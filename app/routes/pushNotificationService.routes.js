const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebase/serviceAccountKeys.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendPushNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

module.exports = { sendPushNotification };

// const token = "dOCG-9vBRA6Evf4UVDvoPT:APA91bEJ6yp4RrnzsNSfHtsdgZWhqOoYyrLd4VzictCgTZkoYSKD1JiB7dL91Kt6ybtqM94Q9v26WnDQbAXOtB2z5_euELZno6BK-PxEp8dj_1uVyVa45OGNQkj2H_7ak9O0rzov59JD";
// const title = "New Message From Prajwal";
// const body = "Message from push notification server";

// try {
//   sendPushNotification(token, title, body);
//   console.log("Notification sent successfully");
// } catch (error) {
//   console.error("Failed to send notification:", error);
// }