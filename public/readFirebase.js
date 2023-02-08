const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const admin=require("firebase-admin")
const  fileURLToPath =require("url");
const path=require("path");
const router = express.Router()
const { router } = require('../app');

var serviceAccount = path.join(__dirname,"./trunk-raspberry-pi-tah-firebase-adminsdk-pxjji-d8f129d255.json");
// Initialize Firebase
 const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Realtime Database and get a reference to the service
const db = getFirestore();
const usercollection =  db.collection('main')//read main
 async function readdoc(){
const doc=await usercollection.get();
doc.forEach(doc=>{
 console.log(doc.data())
})
}
router.get('/fire', async (req, res) => {

  const main = db.collection('main')
  const snapshot = await main.get()
  let datas = []
  snapshot.forEach(doc => {
    datas.push(doc.data())
  })
  res.json(datas)
})
module.exports=router;
