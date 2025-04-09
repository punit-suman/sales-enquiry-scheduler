const express = require('express');
const cron = require('node-cron');
const { triggerTwilioWhatsappMsg } = require('./twilio');
const app = express();
const port = process.env.PORT || 8080;

// Schedule task to run every minute
cron.schedule('* * * * *', () => {
  console.log('hello world', new Date().toISOString());
    triggerTwilioWhatsappMsg({body: {todayPending: 'Trial', olderPending: 'Trial'}, to: '7061972084'})
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express API' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});