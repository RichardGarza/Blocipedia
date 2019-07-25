const stripe = require('stripe')('sk_test_hhky2Kl3ch9jrKLQdhmJdJCr00q9pvYCPM');
const bodyParser = require('body-parser');
const endpointSecret = 'whsec_3LX3S9l4RvYv8kwE5ID8mC3Gvz1wV5pf';
const userController = require('../controllers/userController');

module.exports = {

  init(app, express){
    app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
      const sig = request.headers['stripe-signature'];
    
      let event;
    
      try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
      }
    
      // Handle the checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        handleCheckoutSession(session);
        userController.upgrade(req, res, next);

      }
    
      // Return a response to acknowledge receipt of the event
      response.json({received: true});
    });
    
    app.listen(8000, () => console.log('Running on port 8000'));

  }
}

