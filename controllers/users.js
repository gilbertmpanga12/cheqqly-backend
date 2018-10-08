module.exports.createUser = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
            collectionName.doc(body.merchantId).set({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phoneNumber: body.phoneNumber,
                merchantId: body.merchantId
            }).then(user => {
                res.status(200).send({message:'Profile successfully created'});
            });
        }catch(err){
            res.status(500).send({message:'Failed to create user. Something went wrong'});
        }
    }
}
module.exports.editNames = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
            collectionName.doc(body.merchantId).update({
                firstName: body.firstName,
                lastName: body.lastName
            }).then(user => {
                res.status(200).send({message:'Names  successfully updated'});
            });
        }catch(err){
            res.status(500).send({message:'Failed to update names. Something went wrong'});
        }
    }
}
module.exports.phoneNumber = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
            collectionName.doc(body.merchantId).update({
                phoneNumber: body.phoneNumber
            }).then(user => {
                res.status(200).send({message:'Phone number successfully updated'});
            });
        }catch(err){
            res.status(500).send({message:'Failed to update Phone number . Something went wrong'});
        }
    }
}
module.exports.email = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
            collectionName.doc(body.merchantId).update({
                email: body.email
            }).then(email  => {
                res.status(200).send({message:'Email successfully updated'});
            });
        }catch(err){
            res.status(500).send({message:'Failed to update email. Something went wrong'});
        }
    }
}

module.exports.paymentRequest = (collectionName) => {
    return (req,res) => {
        let body = req.body;
        try{
            collectionName.add({
                requestMessage: `${body.fullName} requests ${body.amount}`,
                date: Date.now(),
                requester: body.requester
            }).then(()  => {
                res.status(200).send({message:'Request sent!'});
            });
        }catch(err){
            res.status(500).send({message:'Failed to send request! Something went wrong'});
        }
    }
}
