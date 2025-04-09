const express = require('express');
const cron = require('node-cron');
const { triggerTwilioWhatsappMsg } = require('./twilio');
const { enquiries } = require('./queries/sales-enquiries');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();

// Schedule task to run every minute
cron.schedule('0 */1 * * *', () => {
    console.log('Triggering alert: ', new Date().toISOString());
    enquiries();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    enquiries();
    // triggerTwilioWhatsappMsg({body: {todayPending: 'Trial', olderPending: 'Trial'}, to: '7061972084'})
  res.json({ message: 'Welcome to the Express API' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});