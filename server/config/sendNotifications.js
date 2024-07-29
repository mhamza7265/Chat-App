const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../service-account-file.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging();

const sendNotifications = (registrationToken, message, array) => {
  return new Promise((resolve, reject) => {
    // This registration token comes from the client FCM SDKs.
    const d = new Date();
    console.log("token", registrationToken);

    const tokenKey = array ? "tokens" : "token";

    const mesg = {
      data: {
        score: "850", //"850",
        time: d.getHours() + ":" + d.getMinutes(), //"2:45",
        title: message.title,
        body: message.body,
      },
      [tokenKey]: registrationToken,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    if (array) {
      messaging
        .sendMulticast(mesg)
        .then((response) => {
          // Response is a message ID string.
          //   console.log("Successfully sent message:", response);
          console.log("notificationRes", response);
          return resolve({ status: true, response });
        })
        .catch((error) => {
          //   console.log("Error sending message:", error);
          return reject({ status: false, error });
        });
    } else {
      messaging
        .send(mesg)
        .then((response) => {
          // Response is a message ID string.
          //   console.log("Successfully sent message:", response);
          console.log("notificationRes", response);
          return resolve({ status: true, response });
        })
        .catch((error) => {
          //   console.log("Error sending message:", error);
          return reject({ status: false, error });
        });
    }
  });
};

module.exports = sendNotifications;
