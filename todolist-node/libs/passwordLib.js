//include packages
const bcrypt=require('bcrypt');
const saltRounds=10;
//function - to convert plain password into hashpassword
let hashPassword=(myPlainTextPassword)=>{
    let salt=bcrypt.genSaltSync(saltRounds);
    let hash=bcrypt.hashSync(myPlainTextPassword, salt);
    return hash;
}
//function - to compare hashpassword with password input
let comparePassword=(oldPassword, hashPassword, cb)=>{
    
    bcrypt.compare(oldPassword, hashPassword, (err, res)=>{
        if(err){
            console.log("ERROR IN PASSWORD COMPARISON");
            cb(err, null)
        } else{
            console.log("RESPONSE OF PASSWORD COMPARISON");
            console.log(res);
            cb(null, res)
        }
    })
}
//---------------------------------------------------------------
//function exported
module.exports={
    hashPassword:hashPassword,
    comparePassword:comparePassword
}
//----------------------------------------------------------------