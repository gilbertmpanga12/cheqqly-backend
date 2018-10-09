const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const admin = require('firebase-admin');
const serviceAccount = require("./config.json");
const usersController = require('./controllers/users');
const paymentsController = require('./controllers/payments');
// const puppeteer = require('puppeteer');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cheqqly-app.firebaseio.com"
});

const firestoreConfig = admin.firestore();
firestoreConfig.settings({
    timestampsInSnapshots: true
});


app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
/*
Pupbot
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://cheqqly-pup.firebaseapp.com/',{waitUntil: "load"});
  
    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.$('#payment-form').then(elem => {
        console.log(elem);
    }).catch(err => {
        console.log(err);
    });
    await browser.close();
  })();

*/
const verify = () => {
    return (req,res,next) => {
        let idToken = req.body._idToken;
        console.log('my token',idToken)
        admin.auth().verifyIdToken(idToken).then((claims) => {
            if (claims.uid) {
              next();
            }
        }).catch(error => {
            res.send({message: 'Invalid user'}).end();
        });
    }
}





const userCollection = admin.firestore().collection('users');
const paymentRequest = admin.firestore().collection('paymentsRequests');
const revenueCollected = admin.firestore().collection('revenueCollected');


app.post('/app/new-account', verify(),usersController.createUser(userCollection));
app.put('/app/edit-name',verify(),usersController.editNames(userCollection));
app.put('/app/edit-phone',verify(),usersController.phoneNumber(usersController));
app.put('/app/edit-email',verify(),usersController.email(userCollection));
app.post('/app/make-request',verify(),usersController.paymentRequest(paymentRequest));
app.post('/app/charge',verify(),paymentsController.storeRevenue(revenueCollected));


app.listen(3002,() => {
console.log('App started at 3000');
});