const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const admin = require('firebase-admin');
// const serviceAccount = require("./config.json");
const usersController = require('./controllers/users');
const paymentsController = require('./controllers/payments');
const stripe = require('stripe')('sk_live_f71xveBbU5d1tV7yTZSSlNDG');
// pk => pk_test_fCm0HDYhdfBfsQsJHmds82gl
// tk => sk_test_PwLVZila4ct2mOp9gOaRfiNx
const stripe_test = require('stripe')('sk_test_PwLVZila4ct2mOp9gOaRfiNx');
const compression = require('compression');
const mailBot = require('./controllers/email');
const BitlyClient = require('bitly');
const bitly =  new BitlyClient.BitlyClient('8410febad86b47141fde3f7be12ce2897de38c20');

// const puppeteer = require('puppeteer');

// refer to firebase admin sdk config 
// admin.initializeApp({
//   credential: admin.credential.cert(
//     {

//     }
//   ),
//   databaseURL: ""
// });

const firestoreConfig = admin.firestore();
firestoreConfig.settings({
    timestampsInSnapshots: true
});


app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
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
        let idToken = req.get('Authorization');
        admin.auth().verifyIdToken(idToken).then((claims) => {
            if (claims.uid) {
              next();
            }
        }).catch(error => {
            res.send({message: 'Invalid user'}).end();
        });
    }
}

app.on('onSuccessfulPayment',function(data){
    return mailBot.mailBot(data);
});





const userCollection = admin.firestore().collection('users');
const paymentRequest = admin.firestore().collection('paymentsRequests');
const revenueCollected = admin.firestore().collection('revenueCollected');


app.post('/app/new-account', verify(),usersController.createUser(userCollection));
app.post('/app/edit-name',verify(),usersController.editNames(userCollection));
app.put('/app/edit-phone',verify(),usersController.phoneNumber(usersController));
app.put('/app/edit-email',verify(),usersController.email(userCollection));
app.put('/app/edit-businessname',verify(),usersController.businessName(userCollection));
app.post('/app/charge',paymentsController.storeRevenue(revenueCollected,stripe,app,admin));
app.post('/app/test-charge',paymentsController.testCharge(stripe_test));
app.get('/app/get-revenue',verify(),paymentsController.getTotalRevenue(revenueCollected));
app.post('/app/request-withdraw',verify(),paymentsController.requestWithdraw(paymentRequest));
app.get('/app/get-profile',verify(),usersController.getProfile(userCollection));
app.get('/app/get-transactions',verify(),paymentsController.allTranscations(revenueCollected));
app.get('/app/total-revenue',verify(),paymentsController.getTotalRevenue(revenueCollected));
app.get('/app/all-notifications',verify(),paymentsController.notifications);
app.post('/app/get-terminal-link',verify(),usersController.generateShortUrl(userCollection,bitly));

// process.env.PORT
app.listen(process.env.PORT || 5000,() => {
console.log('App started at 3002');
});