module.exports.storeRevenue = (collectionName,stripe) => {
    return async (req,res) => {
        let body = req.body;
        let stripeToken = req.body;
        console.log(stripeToken.id);
        try{
            await stripe.charges.create({
                amount: body.amount,
                currency: 'usd',
                description: 'Example charge',
                source: stripeToken.id,
                statement_descriptor: 'Custom descriptor',
                capture: false,
                metadata: {
                    amount: body.amount,
                    merchantId: body.merchantId,
                    date: Date.now()
                }
              }).then(charged => {
                  console.log('Charged user successfully');
              }).catch(error => {
                  console.log(error);
                console.log('failed to charge customer');
              });
            await collectionName.add({
                amount: body.amount,
                merchantId: body.merchantId,
                date: Date.now() 
            }).then(user => {
                res.status(200).send({message:`Successully paid ${body.amount} to ${body.businessName}`});
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
                            total += doc.data().amount;
                            
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