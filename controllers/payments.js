module.exports.storeRevenue = (collectionName,stripe) => {
    return async (req,res) => {
        let body = req.body;
        let stripeToken = req.body.stripeToken;
        try{
            stripe.charges.create({
                amount: body.amount,
                currency: 'usd',
                description: 'Example charge',
                source: stripeToken,
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
                console.log('failed to charge customer');
              });
            collectionName.add({
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
        let body = req.body;
        let total = 0;
            try{
               await userCollection.doc(body.merchantId).get().then(snapShot => {
                    snapShot.forEach(doc => {
                        total += doc.data().amount;
                    });
                });
                res.send({total: total});
            }catch(error){
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