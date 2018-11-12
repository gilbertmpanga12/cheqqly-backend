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

// const puppeteer = require('puppeteer');


admin.initializeApp({
  credential: admin.credential.cert(
    {
        "type": "service_account",
        "project_id": "cheqqly-app",
        "private_key_id": "f93b83662017e13dd4be8b5290bbe02277a27288",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDX9PQkrr+8SixU\nftwZ0MiYgCRc6yEcSXEzly4Jjh9PPRtGKUwhrjLnz3lz2ahafgaoYKZSGVIbbnzw\nVkwuPULaO+nYxyEwhTbCCWVv5xo+tEg9/6QU0njWNExFzRxDke+XFVRck8Q4OLQq\n3fBYPdI1637Vwj5aKf7V6gDmxKhvf8bEdFbD5TMUKIqDUFhxl7ccPyPoO8UvIcqd\nn41E2XRirAn9n5W36OX19tzXuBpXE+Yn00Yxc8bQomUO9F87+Gfxi4U1JBxZSFQK\nihgAdSYNTpmtJTW/iWomjxvRyBhSPhsmnwa0LbHY1ryr0+3YV0pMPV8wj10Lt3eg\nwWwGp33bAgMBAAECggEARGRECXX6LNREs8G1TMutK3axjWe9harQmekP4GDNE5gj\nkhW0EZqMbpNrQEA3K+lrjFmHcsqoER3tnWOHHsGx8VE2Hrv5i9c0X0EAie7jheYs\nVs4mFZ4OPLA1U4nAoLmP6gYMQIFfi/qRPF4rJpb1grQA6AtrGbzhArfn7y1qtlxo\np9M8N+0QkjWSfZHoJHF7mttKZN0QEqnjnvfdy4dxAJvll4lI558fDIaKH6RhZ5q2\nZM9RJn9MXkmi9vzQnfx32rrPlwlGfgbA6x67BwuxHQCLyi4B7QVgaO/etcDtwmRH\nDoMRHS2qiGf8AqdRrM6ElWfTHxU1wqt5bIqZhSgDwQKBgQD9sKbpAScVn2QLobf6\nBqivSjwr13T5Dwn17lixj1RoMhhoh1PNBEaCB4nSK1ebFJX9Ks5188qwKeLEHuvW\nIlnKeuuN9Zc6Gt2QMp84qzBKhL8qD9tUFfdW4tCxpWl9inRor984yeiUWnpjVk32\nDRumgzfNoD6AHnZdzY8no6vBewKBgQDZ7Fib/OufbrKA49XMLVDXcNSQYX/Zzrxq\nzuI/6J49fVja3GbKdE8vzF0MX41ednrTmBcUxeA2ZI/tsvfzYCJZJAzjAmkVN9PU\ndZq/GAHxDGHJ/eTZbDQOrCBOAZkvw27ylJ8fdGSe6tXQEbrBSWYgfJrxma+Xy0hT\n4fj/c+yXIQKBgF1SGlQkJGiD1Z2hw7eps2un9zJ5c4Ia0iMxplbKztX1d50cCuuj\n4vv6Iey6HOPjUrlqgcBKCgl7nvteFIsU38roJLZ33UV2lIJy3LdP4dfHtTqX0qq/\n2diQXwy6OHAB+oh4CbkuLOxFzDe2i78zWzSJmIF/rP4cNpaTA1Illwz5AoGAfNdQ\ny8vQj70ytXPP/u/W6BTTMQMp4vT0K5vpMQNp43/zby3kFQccdh11EKmMqxjktGLk\nlhnloENr0Jg+Q0ZHZxmn6ERxPp6E06mrxN1T/2tAeh7hA01hZSZmO0nfH+WtoXpS\nzgo3unJ9mn0Np70MrH+1o8KPPT5PaP6DTpRybQECgYBIOEqtLtdm8Qc6bp8nsFju\nLkbU4Ul2XpNvxxw7jkvE3Eec8NZRxTiqgJJarLXnNp/mqQlPcX1VS/+F08y7Xovv\nTj/88T+U7X8XmQPr2801D9V2zRDW8k6tOjkz5e5J/HK24/Y2wCqjFy8Qdd6wkTTZ\nw1PX7BGZ0SNluooZAuSpmA==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-82h6v@cheqqly-app.iam.gserviceaccount.com",
        "client_id": "100001993519979005949",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-82h6v%40cheqqly-app.iam.gserviceaccount.com"
      }
  ),
  databaseURL: "https://cheqqly-app.firebaseio.com"
});

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



// verify(),
app.post('/app/new-account', verify(),usersController.createUser(userCollection));
app.post('/app/edit-name',verify(),usersController.editNames(userCollection));
app.put('/app/edit-phone',verify(),usersController.phoneNumber(usersController));
app.put('/app/edit-email',verify(),usersController.email(userCollection));
app.put('/app/edit-businessname',verify(),usersController.businessName(userCollection));
app.post('/app/charge',paymentsController.storeRevenue(revenueCollected,stripe_test,app));
app.post('/app/test-charge',paymentsController.testCharge(stripe_test));
app.get('/app/get-revenue',verify(),paymentsController.getTotalRevenue(revenueCollected));
app.post('/app/request-withdraw',verify(),paymentsController.requestWithdraw(paymentRequest));
app.get('/app/get-profile',verify(),usersController.getProfile(userCollection));
app.get('/app/get-transactions',verify(),paymentsController.allTranscations(revenueCollected));
app.get('/app/total-revenue',verify(),paymentsController.getTotalRevenue(revenueCollected));
app.get('/app/all-notifications',verify(),paymentsController.notifications);

// process.env.PORT
app.listen(5000,() => {
console.log('App started at 3002');
});