import Order from "models/Order";
import { connectToDB } from "@app/mongodb/database";
import { NextResponse } from "next/server";
import User from "@models/User";
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


async function getCartItems(line_items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        title: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data.length) {
        resolve(cartItems);
      }
    });
  });
}

export async function POST (req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;


      const line_items = await stripe.checkout.sessions.listLineItems(
        event.data.object.id
      );

      const orderItems = await getCartItems(line_items);
      const userId = session.client_reference_id;
      const amountPaid = session.amount_total / 100;

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
        amountPaid,
      };

      await connectToDB();

      const orderData = {
        user: userId,
        paymentInfo,
        orderItems,
      };

      console.log(orderData)

      // await Order.create(orderData);

      const user = await User.findById(userId);
      user.cart = [];
      user.orderList.push(orderData);
      await user.save();
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Webhook handler failed. View logs." }, { status: 400 });
  }
}
