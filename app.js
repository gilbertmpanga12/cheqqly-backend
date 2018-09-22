const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const admin = require('firebase-admin');

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000,() => {
console.log('App started at 3000');
});