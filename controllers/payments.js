module.exports.storeRevenue = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
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
