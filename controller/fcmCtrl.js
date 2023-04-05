const messaging = require("../configs/fbConfig");

const fcmCtrl = {
  sendMsg: async (title, message, tokens) => {
    const payload = {
      notification: {
        title: title,
        body: message,
        icon: "icon url",
      },
    };
    messaging
      .sendToDevice(tokens, payload)
      .then((response) => {
        console.log("Successfully sent message:", response);
        res.status(200).json({ message: "Message sent successfully" });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message" });
      });
  },
};

module.exports = fcmCtrl;
