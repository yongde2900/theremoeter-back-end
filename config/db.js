const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const serviceAccount = require('./trunk-raspberry-pi-tah-firebase-adminsdk-pxjji-d8f129d255.json');

module.exports = () => {
    initializeApp({ credential: cert(serviceAccount) })
}