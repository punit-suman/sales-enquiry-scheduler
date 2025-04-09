require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function triggerTwilioWhatsappMsg ({ body, to }) {
    try {
        client.messages
            .create({
                from: 'whatsapp:+15557099144',
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                to: `whatsapp:+91${to}`,
                contentSid: process.env.TWILIO_CONTENT_SID,
                contentVariables: JSON.stringify({"1": body.todayPending, "2": body.olderPending})
            })
            .then((message) => console.log(message))
            .catch((error) => {
                console.error('Error sending message: ', error);
            });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    triggerTwilioWhatsappMsg
}