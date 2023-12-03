import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).end(); // Unauthorized
  }

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const { cartItems } = req.body

  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        { shipping_rate: "shr_1MfugvDgraNiyvtnIq8XUhHz" },
        { shipping_rate: "shr_1MfufhDgraNiyvtnDGef2uwK" },
      ],
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "{{PRICE_ID}}",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    };

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(params);
    res.redirect(303, session.url);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}
