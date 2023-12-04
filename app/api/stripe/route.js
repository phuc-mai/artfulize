import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req, res) => {
  if (req.method === 'POST') {
    const cart = await req.json()
    console.log(cart)

    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1MfufhDgraNiyvtnDGef2uwK' },
        ],
        line_items: cart.map((item) => {
          return {
            price_data: { 
              currency: 'cad',
              product_data: { 
                name: item.title,
                images: [item.image],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled:true,
              minimum: 1,
            },
            quantity: item.quantity
          }          
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      /* Create Checkout Sessions from body params */
      const session = await stripe.checkout.sessions.create(params);

      return new Response(JSON.stringify(session), { status: 200 })
    } catch (err) {
      console.log(err)
      return new Response("Failed to checkout", { status: 500 })
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}