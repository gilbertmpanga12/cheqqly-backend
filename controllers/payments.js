module.exports.storeRevenue = (collectionName,stripe,app,admin) => {
    return async (req,res) => {
        let body = req.body;
        let stripeToken = req.body;
        let amount = parseFloat(body.amount) * 100;
        
        //let date = `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`
        try{
            /*statement_descriptor: 'Custom descriptor',*/
            

          await stripe.charges.create({
                amount: amount,
                currency: 'usd', // body.currency
                description: `Payment: ${body.amount} sent to ${body.businessName}`,
                source: stripeToken.id,
                capture: false,
                metadata: {
                    amount: body.amount,
                    merchantId: body.merchantId,
                    date: Date.now()
                }
              }).then(charged => {
                  console.log(charged);
                  console.log('Charged user successfully');
                  collectionName.add({
                    amount: parseFloat(body.amount),
                    merchantId: body.merchantId,
                    date: Date.now(),
                    businessName: body.businessName
                }).then(user => {
                    console.log(user);
                    app.emit('onSuccessfulPayment',{email:body.email,businessName:body.businessName,
                        amount:body.amount, transactionId: user.id, merchantId: body.merchantId,
                    admin: admin
                    });
                });
                
                  res.status(200).send({message:`Successully paid ${amount*1/100} to ${body.businessName}`});
              }).catch(err => {
                res.status(500).send({message: `Card declined. Please check your details`});
              });
           

        }catch(err){
            res.status(500).send({message:`
            Failed to process payment. Please check if you entered right card 
            details or check is card is credited
            `});
        }
    }
}

module.exports.getTotalRevenue = (collectionName) => {
    return async(req,res) => {
        let body = req.query;
        let total = 0;
        let numberOfCustomers;
            try{
               await collectionName.where('merchantId','==',body.merchantId).get().then(snapShot => {
                    if(snapShot){
                        numberOfCustomers = snapShot.size;
                        snapShot.forEach(doc => {
                            console.log(doc.data().amount);
                            total +=  parseFloat(doc.data().amount);
                            
                        });
                    }
                });
                res.send({total: total,numberOfCustomers: numberOfCustomers});
            }catch(error){
                console.log(error);
                res.send({message: `Failed to fetch revenue. Something went wrong`});
            }
    }
}
module.exports.requestWithdraw = (collectionName) => {
    return async (req,res) => {
        let body = req.body;
        try{
            await collectionName.doc(body.merchantId).set({
                withdrawOptions: body.withdrawOptions,
                customWithdraw: body.customWithdraw,
                reason: body.reason,
                amount: body.amount,
                bankAccount: body.bankAccount,
                date: Date.now()
            }).then(user => {
                res.status(200).send({message:'Request sent successfully. We\'ll get back to you'});
            });
        }catch(error){
            console.log(error);
            res.send({message: `Failed to fetch revenue. Something went wrong`});
        }
    }
}
module.exports.allTranscations = (collectionName) => {
    return async(req,res) => {
        let body = req.query;
        console.log(body);
        let arrayKeeper = [];
            try{
               await collectionName.where('merchantId','==',body.merchantId).get().then(snapShot => {
                snapShot.forEach(doc => {
                       
                        arrayKeeper.push(doc.data());
                    });
                });
                res.send({transactions: arrayKeeper});
            }catch(error){
                console.log(error);
                res.send({message: `Failed to fetch all transactions. Something went wrong`,errorData:[]});
            }
    }
}
module.exports.notifications = () => {
    return (req,res) => {
        res.send([]);
    }
}
module.exports.testCharge = (stripe_test) => {
    return  (req,res) => {
        let body = req.body;
        let stripeToken = req.body;
        let amount = parseFloat(body.amount) * 100;
        console.log(stripeToken.id);
         stripe_test.charges.create({
            amount: amount,
            description:  `Payment: ${amount} sent to ${body.businessName}`,
            source: stripeToken.id,
            capture: false,
            currency: 'usd',
            metadata: {
                amount: body.amount,
                merchantId: body.merchantId,
                date: Date.now()
            }
          }).then(charged => {
              
             res.status(200).send(`You have successfully sent $${amount*1/100}`);
          }).catch(error => {
              console.log(error);
            res.status(500).send('failed to charge card');
          });
        }
}
