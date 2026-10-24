// Load environment variables from .env file
require('dotenv').config();

// This is your test secret API key.
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:8888';
const IP_DOMAIN = 'http://192.168.1.61:8888';

app.post('/create-checkout-session', async (req, res) => {

  const { language } = req.body;

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1RA8NbINtVMv4lc9gqPi45QY',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${IP_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    locale: language,
  });
  
  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));