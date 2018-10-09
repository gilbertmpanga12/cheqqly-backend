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
                capture: 'False',
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
            collectionName.doc(body.merchantId).set({
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
