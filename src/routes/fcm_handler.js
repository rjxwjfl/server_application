const { messaging } = require("../app");

app.post('/send-notification', (req, res) => {
    const { message, token } = req.body;
    const payload = {
      notification: {
        title: 'New Message',
        body: message,
        icon: 'your-icon-url',
      },
    };
    messaging.sendToDevice(token, payload)
      .then((response) => {
        console.log('Successfully sent message:', response);
        res.status(200).json({ message: 'Message sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
      });
  });
