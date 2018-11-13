const nodemailer = require('nodemailer');

module.exports.mailBot = function(data){
    const month = new Date().getMonth();
const months =  [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
  ];
const date = `${months[month]} ${new Date().getDate()}, ${new Date().getFullYear()} ${new Date().toUTCString()}`;
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'gilbertmpanga.gm@gmail.com',
        pass: 'G-706186_vc*GOAT __main'
    }
});
let mailOptions = {
    from: '"Gilbert Mpanga" <gilbertmpanga.gm@gmail.com>', // sender address
    to: `${data.email}`, // list of receivers req.body.to
    subject: `Receipt for your payment to ${data.businessName}`, // Subject line
    text: `
    Cheqqly
    `, // plain text body
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>
      Cheqqy payments
    </title>
    <style type="text/css">
/*<![CDATA[*/
    body{
    background:rgb(242, 242, 242);
    }
    table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    }
    th, td {
    padding: 15px;
    }
    th {
    text-align: left;
    }
    table{
    border-collapse: collapse;
    }

    table#t01 tr:nth-child(even) {
    background-color: #eee;
    }
    table#t01 tr:nth-child(odd) {
    background-color: #fff;
    }
    table#t01 th {
    color: white;
    background-color: black;
    }
    h1{

    font-family: "Open Sans", sans-serif;
    font-weight: 900;
    line-height: 14px;
    text-transform: uppercase;
    line-height: 1.5;

    color: #32325d;
    font-size: 1.1em;

    }
    p,small,table,span,h4{
    font-family: "Open Sans", sans-serif;
    }
    .card{
    padding:5%;


    }
p{
font-size: 16px;
font-weight: normal;
}
.footer-txt{
font-size:10px;
}

    /* Add some padding inside the card container */
    .container {
    padding: 2px 16px;
    }
    /*]]>*/
    </style>
    <link href=
    "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
    rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Righteous"
    rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div class="card" style="background:#fff;">
      <h1>
        CHEQQLY
      </h1>
      <p style="font-size:15.3px;">
        Transaction id: sjkdcdsnbsxamfhu
      </p>
      <h4>
        Hello there,
      </h4><span style=
      "font-size:14px;color:#c88039;font-weight:bold;text-decoration:none;font-size:16px;">You
      sent a payment of $${data.amount} to
      ${data.businessName}.</span><br />
      <br />
      <h4>
        It may take a few moments for this transaction to appear in
        your account.
      </h4>
      <div style="display:flex;">
        <div style="width:45%;">
          <h4>
            Merchant
          </h4>
          <p>
            ${data.businessName}
          </p>
          <p>
            <a href=
            "mailto:support@cheqqly.com">support@cheqqly.com</a>
          </p><br />
          <table style="width:100%">
            <tr>
              <th>
                Description
              </th>
              <th>
                QTY
              </th>
              <th>
                Amount
              </th>
            </tr>
            <tr>
              <td>
                Payment to ${data.businessName}
              </td>
              <td>
                1
              </td>
              <td>
                $${data.amount}
              </td>
            </tr>
          </table><br />
          <hr style="width:100%;" />
          <h4>
            Issues with this transaction?
          </h4>
          <p>
            You have 180 days from the date of the transaction to
            open a dispute in the Resolution Center.
          </p>
        </div>
      </div>
      <p style="font-size:14px;" class="">
        Copyright © Cheqqly. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `
};





let bussinessMail = {
    from: '"Gilbert Mpanga" <gilbertmpanga.gm@gmail.com>', // sender address
    subject: `You have received  a payment from a customer - Cheqqly`, // Subject line
    text: `
    Cheqqly
    `, // plain text body
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>
      Cheqqy payments
    </title>
    <style type="text/css">
/*<![CDATA[*/
    body{
    background:rgb(242, 242, 242);
    }
    table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    }
    th, td {
    padding: 15px;
    }
    th {
    text-align: left;
    }
    table{
    border-collapse: collapse;
    }

    table#t01 tr:nth-child(even) {
    background-color: #eee;
    }
    table#t01 tr:nth-child(odd) {
    background-color: #fff;
    }
    table#t01 th {
    color: white;
    background-color: black;
    }
    h1{

    font-family: "Open Sans", sans-serif;
    font-weight: 900;
    line-height: 14px;
    text-transform: uppercase;
    line-height: 1.5;

    color: #32325d;
    font-size: 1.1em;

    }
    p,small,table,span,h4{
    font-family: "Open Sans", sans-serif;
    }
    .card{
    padding:5%;


    }
p{
font-size: 16px;
font-weight: normal;
}
.footer-txt{
font-size:10px;
}

    /* Add some padding inside the card container */
    .container {
    padding: 2px 16px;
    }
    /*]]>*/
    </style>
    <link href=
    "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
    rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Righteous"
    rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div class="card" style="background:#fff;">
      <h1>
        CHEQQLY
      </h1>
      <p style="font-size:15.3px;">
        Transaction id: sjkdcdsnbsxamfhu
      </p>
      <h4>
        Hello there,
      </h4><span style=
      "font-size:14px;color:#c88039;font-weight:bold;text-decoration:none;font-size:16px;">You
      have received a payment of $${data.amount} from one of your customers through Cheqqly
      .</span><br />
      <br />
      <h4>
        It may take a few moments for this transaction to appear in
        your account.
      </h4>
      <div style="display:flex;">
        <div style="width:45%;">
          <h4>
            Customer contact
          </h4>
          <p>
            ${data.email}
          </p>
          <p>
            <a href=
            "mailto:support@cheqqly.com">support@cheqqly.com</a>
          </p><br />
          <table style="width:100%">
            <tr>
              <th>
                Description
              </th>
              <th>
                QTY
              </th>
              <th>
                Amount
              </th>
            </tr>
            <tr>
              <td>
                Payment to ${data.businessName}
              </td>
              <td>
                1
              </td>
              <td>
                $${data.amount}
              </td>
            </tr>
          </table><br />
          <hr style="width:100%;" />
          <h4>
            Issues with this transaction?
          </h4>
          <p>
            You have 180 days from the date of the transaction to
            open a dispute in the Resolution Center.
          </p>
        </div>
      </div>
      <p style="font-size:14px;" class="">
        Copyright © Cheqqly. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `
};



transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
        return;
    });

    data.admin.auth().getUser(data.merchantId).then(usr => {
        bussinessMail.to = usr.email;
        transporter.sendMail(bussinessMail, (error, info) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
                return;
            });
    }).catch(err => {
        console.log(err);
    });
}