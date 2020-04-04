//including packages
const mongoose=require('mongoose');
//including files
require('./../models/auth');
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');
const token=require('./../libs/tokenLib');
const logger=require('./../libs/loggerLib');
//creating model instance
const AuthModel=mongoose.model('Auth');
//---------------------------function definitions-----------------------------------------------------
//function - to check whether authToken is present in api call
let isAuthorised=(req, res, next)=>{
    //if authToken is present - find it in auths collection
    //console.log(req.params);
    //console.log(req.body);
    if(req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')){
        AuthModel.findOne({authToken:req.params.authToken || req.body.authToken || req.query.authToken
            || req.header('authToken')})
            .exec((err, authDetails)=>{
        if(err){
            logger.error(err.message, "isAuthorised function", 10);
            let apiResponse=response.generate(true, 'Authorised Failed', 500, null);
            res.send(apiResponse);
        } else if(check.isEmpty(authDetails)){
            let apiResponse=response.generate(true, 'Authorisation Key is missing', 404, null);
            res.send(apiResponse);
        } else{
            token.verifyClaims(authDetails.authToken, authDetails.tokenSecret, (err, decoded)=>{
                if(err){
                    console.log(err);
                } else {
                    req.user={userId:decoded.data.userId};
                    next();
                }
            })
            }
        })        
    } else{ //if authToken is missing 
        logger.error("Authorisation Key is Missing", "isAuthorised function", 10);
        let apiResponse=response.generate(true, "Authorisation key is missing", 500, null);
        res.send(apiResponse);
    }
}
//-----------------------------------------------------------------------------------------------------
module.exports={
    isAuthorised:isAuthorised
}
