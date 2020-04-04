//import packages
const jwt=require('jsonwebtoken');
const shortId=require('shortid');
//secret key
const secretKey="Aquickbrownfoxjumpsoverthelazylittledog";
//--------------------------------------------------------------------------
//function - to generate jwt token
let generateToken=(data, cb)=>{
    try{
        let claims={
            jwtid:shortId.generate(),
            iat:Date.now(),
            exp:new Date("2020-06-30T05:43:00.000Z").getTime()/1000,
            sub:'authToken',
            iss:'todolist',
            data:data
        }
        let tokenDetails={
            token:jwt.sign(claims, secretKey),
            tokenSecret:secretKey
        }
       // console.log(tokenDetails);
        cb(null, tokenDetails);
    }
    catch(err){
        cb(err, null);
    }
}//generateToken function ended
//---------------------------------------------------------------------------------------
//function - to verify claims
let verifyClaims=(token, secretKey, cb)=>{
    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
            cb(err, null);
        } else{
            cb(null, decoded)
        }
    })
}//verify claims ended
//------------------------------------------------------------------------------------------
//function - to verify claims without using secret key
let verifyClaimsWithoutSecret=(token, cb)=>{
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            cb(err, null);
        } else{
            cb(null, decoded);
        }
    })
}//verifyclaimswithoutsecret ended
//-------------------------------------------------------------------------------------------
//functions exported
module.exports={
    generateToken:generateToken,
    verifyClaims:verifyClaims,
    verifyClaimsWithoutSecret:verifyClaimsWithoutSecret
}
//--------------------------------------------------------------------------------------------