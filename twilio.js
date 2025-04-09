const accountSid = 'ACaed064ae2ef9de2eb89437470d456ac6';
const authToken = '3be6e85a22911b480039c764d7c89123';
const client = require('twilio')(accountSid, authToken);

async function triggerTwilioWhatsappMsg ({ body, to }) {
    try {
        client.messages
            .create({
                from: 'whatsapp:+15557099144',
                messagingServiceSid: 'MG4bf98e9fd8f1928c73983ec7e09a94d1',
                to: `whatsapp:+91${to}`,
                contentSid: 'HX6ce8fac697c83d5d32e75f1bfb36ea17',
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