//including packages
const shortId=require('shortid');
const mongoose=require('mongoose');
//including library files
const response=require('./../libs/responseLib');
const validateInput=require('./../libs/validationLib');
const check=require('./../libs/checkLib');
const passwordLib=require('./../libs/passwordLib');
const tokenLib=require('./../libs/tokenLib');
const emailLib=require('./../libs/emailLib');


//including models
const UserModel=mongoose.model('User');
const AuthModel=mongoose.model('Auth');
const OTPModel=mongoose.model('otp');

//--------------------------------------Signup function--------------------------------------------------
//function - to allow signup - on success user created and login input allowed
function signupFunction(req, res){
    //console.log("signup function started");

    let validateUserInput=()=>{ //validate email and password
        //console.log("validate user input function called");
        return new Promise((resolve, reject)=>{
        //if email is present as body parameter
        if(req.body.email){
                //console.log(req.body.email);
            if(!validateInput.Email(req.body.email)){
                let apiResponse=response.generate(true, "Email address is not as per format", 400, null);
                reject(apiResponse);
            }else if(check.isEmpty(req.body.password)){
                let apiResponse=response.generate(true, "Password is not as per format", 400, null);
                reject(apiResponse);
            } else{
                //console.log("validate user input function successful");
                resolve(req);
            }
        }
            else {//if email as req.body parameter is note received
                let apiResponse=response.generate(true, "Email address field is blank", 400, null);
                res.send(apiResponse);
            }
        })
    }

    let createUser=()=>{//create user 
        //console.log("create user function started")
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email:req.body.email})
            .exec((err, result)=>{
                if(err){
                    //console.log(err);
                    let apiResponse=response.generate(true, "Some error occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    let newUser=new UserModel({
                        userId:shortId.generate(),
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        email:req.body.email,
                        password:passwordLib.hashPassword(req.body.password),
                        country:req.body.country,
                        countryCode:req.body.countryCode,
                        mobile:req.body.mobile
                    })
    
                    newUser.save((err, result)=>{
                        //conso le.log("result"+result);
                        if(err){         
                            console.log(err); 
                        }
                        else {                            
                            let userObj=result.toObject();
                            delete userObj.password;
                            delete userObj._id;
                            delete userObj.__v;
                            delete userObj.mobile;
                            resolve(userObj);
                        }
                    })//save method ended                    
                } else{
                    let apiResponse=response.generate(true, "User with this email already exists", 500, null);
                    reject(apiResponse);
                }
            })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "User created successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{            
            res.send(err);
        })    
}
//--------------------------------------Login function--------------------------------------------------
//function - to allow login - on success - will open main page of website
function loginFunction(req, res){
    console.log(req.body.email);
    console.log(req.body.password);
    //find user
    let findUser=()=>{//find out user using email body param
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email:req.body.email})
                .exec((err, userDetails)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Some error occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(userDetails)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found", 404, null);
                        reject(apiResponse);
                    }else {
                        //console.log("user with this email found - proceed further");
                        resolve(userDetails); //hand over to next function
                    }
                })
        })
    }
    //validate password
    let validatePassword=(userDetails)=>{
        
        return new Promise((resolve, reject)=>{//match password with record             
            passwordLib.comparePassword(req.body.password, userDetails.password, (err, isMatch)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some error occurred", 500, null);
                    reject(apiResponse);
                } else if(isMatch){
                    //console.log("password matched");
                    
                    let userDetailsObj=userDetails.toObject();
                    delete userDetailsObj.password;
                    delete userDetailsObj._id;
                    delete userDetailsObj.__v;
                    resolve(userDetailsObj); //handover to next function
                } else{
                    let apiResponse=response.generate(true, "Wrong Password : Login Failed", 400, null);
                    reject(apiResponse);
                }
            })
        })
    }
    ///generate token
    let generateToken=(userDetails)=>{
        console.log("generateToken started");
       // console.log(userDetails);
        return new Promise((resolve, reject)=>{
            tokenLib.generateToken(userDetails, (err, tokenDetails)=>{
                if(err){
                    //console.log(err);
                    let apiResponse=response.generate(true, "Failed to generate token", 500, null);
                    reject(apiResponse);
                } else{
                    tokenDetails.userId=userDetails.userId;
                    tokenDetails.userDetails=userDetails;
                    //console.log("here is token details");                    
                    resolve(tokenDetails);
                }
            })
        })
    }
    //save token
    let saveToken=(tokenDetails)=>{
        return new Promise((resolve, reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId}, (err, retrievedTokenDetails)=>{
                if(err){
                    //console.log(err);
                    let apiResponse=response.generate(true, "Save Token : Failed to generate token", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(retrievedTokenDetails)){
                    //console.log("No data found");
                    let newAuthToken=new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.token,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:Date.now()
                    })
                    newAuthToken.save((err, newTokenDetails)=>{
                        if(err){
                            //console.log(err);
                            let apiResponse=response.generate(true, "Save Token : Failed to generate token", 500, null);
                            reject(apiResponse);
                        }else{
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    })//save method ended
                } else {
                    //console.log("Here is else block of save token");
                    retrievedTokenDetails.authToken=tokenDetails.token;
                    retrievedTokenDetails.tokenSecret=tokenDetails.tokenSecret;
                    retrievedTokenDetails.tokenGenerationTime=Date.now();
                    retrievedTokenDetails.save((err, newTokenDetails)=>{
                        if(err){
                            //console.log(err);
                            let apiResponse=response.generate(false, "Save Token : Some error occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    })
                }
            })
        })
    }

    //save token
    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve)=>{
            //console.log(resolve);
            let apiResponse=response.generate(false, "Login Successful", 200, resolve);
            res.send(apiResponse);
        })   
        .catch((err)=>{
            res.send(err);
        })
}

//--------------------------------------logout function--------------------------------------------------
let logoutFunction=(req, res)=>{
    AuthModel.findOneAndRemove({userId:req.body.userId})
        .exec((err, result)=>{
            if(err){
                let apiResponse=response.generate(true, "Some error occurred", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("Data not found");
                let apiResponse=response.generate(true, "Failed to access data ",404, null);
                res.send(apiResponse);
            } else {
                let apiResponse=response.generate(false, "User logged out successfully", 200, result);
                res.send(apiResponse);
            }

        })
}
//----------------------------------------------------------------------------------------------------------
//function - to demand OTP - otp will be sent on success response
let demandOTP=(req, res)=>{
    
    let getUserId=()=>{ //to get user details - use email param
        return new Promise((resolve, reject)=>{
            console.log("Email : "+req.params.email);
                UserModel.findOne({email:req.params.email})
                    .exec((err, userDetails)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Some error occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(userDetails)){
                        console.log("No data found");
                        let apiResponse=response.generate(true, "Failed to access data ",404, null);
                        reject(apiResponse);
                    } else {
                        console.log(userDetails);
                        resolve(userDetails); //sent to next function
                    }
            })            
        })
    }

    let createOTP=(userDetails)=>{//find userDetails.userId in otps collection
        console.log("inside createOTP function");
        return new Promise((resolve, reject)=>{
            OTPModel.findOne({userId:userDetails.userId})
            .exec((err, user)=>{
                if(err){
                    console.log("inside createOTP function : err block");
                    console.log(err);
                    let apiResponse=response.generate(true, "create OTP : Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(user)){//if not found - create new record
                    console.log("inside createOTP function : else if  block");
                    console.log(user);
                    let otp=new OTPModel({                            
                        userId:userDetails.userId,
                        otp:Math.floor(Math.random()*9000+1000),
                        createdOn:Date.now(),
                        email:userDetails.email, 
                        emailDecryptLink : passwordLib.hashPassword(userDetails.email)
                    })
                    //save otp in otps collection
                    otp.save((err, otpDetails)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "create OTP : save : Failed to save OTP", 500, null);
                            reject(apiResponse);
                        } else{                                                       
                            emailLib.sendOTP(otpDetails.otp, otpDetails.email, otpDetails.emailDecryptLink);
                            resolve(otpDetails);
                        }
                    })
                } else { //if record found - update otp with new one
                    console.log("inside createOTP function : else block");
                    user.otp=Math.floor(Math.random()*9000+1000);
                    user.createdOn=Date.now();
                    let encrypticLink=passwordLib.hashPassword(user.email);
                    user.emailDecryptLink=encrypticLink;

                    user.save((err, otpObj)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "create OTP : save - some error occurred", 500, null);
                            reject(apiResponse);
                        } else{
                            console.log(otpObj);
                            emailLib.sendOTP(otpObj.otp, otpObj.email);
                            resolve(otpObj);
                        }
                    })//save ended
                }//else ended
            })//exec ended        
    })//promise ended
}//function ended
        
        
    getUserId(req, res)
        .then(createOTP)
        .then((resolve)=>{
            //console.log("Here send otp id");
            //console.log(resolve);
            let otpObject=resolve.toObject();
            delete otpObject.otp;
            delete otpObject._id;
            delete otpObject.__v;
            delete otpObject.createdOn;
            
            let apiResponse=response.generate(false, "otp sent to email address ", 200, otpObject);
            res.send(apiResponse);
        })
        .catch((err)=>{
            //console.log(err);
            res.send(err);
        })
    
}//function ended
//-------------------------------------------match OTP--------------------------------------------------
//function - to match OTP - reset be allowed on success response
let matchOTP=(req, res)=>{
    
    OTPModel.findOne({userId:req.params.userId})
        .exec((err, result)=>{
            if(err){
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                res.send(apiResponse);                
            } else {//if found - match with body param
                //console.log(result);
                if(result.otp===Number(req.body.otp)){//if match - send success response
                    let otpObj=result.toObject();
                    delete otpObj._id;
                    delete otpObj.otp;
                    delete otpObj.__v;
                    delete otpObj.createdOn;
                    
                    let apiResponse=response.generate(false, "otp matched - redirect to reset", 200, otpObj);
                    res.send(apiResponse);                    
                } else { //if not matched - send error response
                    let apiResponse=response.generate(true, "OTP does not match - try again", 403, null);
                    res.send(apiResponse);
                }                
            }
         })       
    }
    
//--------------------------------------reset password function--------------------------------------------------
//function - to reset password - login be allowed on success response
let resetPassword=(req, res)=>{
    console.log(req.params.email);
    console.log(req.params.code);
    let matchLink=()=>{
        return new Promise((resolve, reject)=>{
            OTPModel.findOne({email:req.params.email, emailDecryptLink:req.params.code})
            .exec((err, result)=>{
                if(err){
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    let apiResponse=response.generate(true, "No such data found", 404, null);
                    reject(apiResponse);
                } else {
                    resolve(result);
                }
            })
        })
    }       

    let savePassword=()=>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email:req.params.email})//find user matching email
        .exec((err, userDetails)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(userDetails)){
                //console.log("no data found");
                let apiResponse=response.generate(true, "No such data found", 404, null);
                res.send(apiResponse);
            } else {                
                userDetails.password=passwordLib.hashPassword(req.body.password);
                userDetails.save((err, user)=>{
                    if(err){                        
                        let apiResponse=response.generate(true, "Password could not be saved", 500, null);
                        res.send(apiResponse);
                    } else{
                        resolve(user);                       
                    }
                })
            }
        })//exec method ended
      }) //promise ended       
    }//function ended

    matchLink(req, res)
        .then(savePassword)
        .then((resolve)=>{                                    
            let apiResponse=response.generate(false, "Password changed successfully", 200, resolve);
            res.send(apiResponse);
        })
        .then((err)=>{
            res.send(err);
        })
}//function ended
//--------------------------------------------------------------------------------------------------------
let getFriendList=(req, res)=>{
    UserModel.findOne({userId:req.params.userId})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("data not found");
                let apiResponse=response.generate(true, "No such data found", 404, null);
                res.send(apiResponse);
            } else {
                let friends=result.friends;
                for(let i=0; i<friends.length; i++){
                    let friend=friends[i];
                    if(friend.friendId===null){
                        friends.splice(i, 1);
                        i--;
                    }
                }
                let apiResponse=response.generate( false, "User's friends data fetched successfully", 200, friends);
                res.send(apiResponse);
            }
        })
}
//------------------------------------------------------------------------------------------------------------
let getContactList=(req, res)=>{
    let userId=req.params.userId;
    let getFriendList=()=>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':req.params.userId})
            .exec((err, user)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(user)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "No Data found", 404, null);
                    reject(apiResponse);
                } else {
                    let friends=user.friends;
                    /*
                     
                    */
                   resolve(friends);
                }
            })

        })
        
    }
    let getNonFriendContacts=(friends)=>{
        return new Promise((resolve, reject)=>{
        UserModel.find()
            .exec((err, contacts)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(contacts)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "Some Error Occurred", 404, null);
                reject(apiResponse);
            } else {
                for(let i=0; i<friends.length; i++){
                    for(let j=0; j<contacts.length; j++){
                        let contact=contacts[j];
                        let friend=friends[i];
                        if(contact.userId===friend.friendId){
                            contacts.splice(j , 1);
                        }
                    }
                }

                for(let k=0; k<contacts.length; k++){
                    let contact=contacts[k];
                    
                    if(contact.userId===req.params.userId){
                        contacts.splice(k , 1);
                    }
                }
                console.log("contacts  :  " + JSON.stringify(contacts));
                resolve(contacts);
            }
        })

        })
    }

    getFriendList(req, res)
        .then(getNonFriendContacts)
        .then((resolve)=>{
            console.log("resolve :"+JSON.stringify(resolve));
            let apiResponse=response.generate(false, "Non friends contacts fetched successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
    
}
//------------------------------------------------------------------------------------------
let acceptFriendRequest=(req, res)=>{
    //append friend request sender data in receiver/acceptor user data
    let appendFriendData=()=>{        
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':req.params.userId})
                .exec((err, userDetails)=>{
                    if(err){
                        //console.log("FunctionsLib::acceptFriendRequest " + err);
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                
                        reject(apiResponse);
                    } else if(check.isEmpty(userDetails)){
                        //console.log("FunctionsLib::acceptFriendRequest " + "No Data found");
                        let apiResponse=response.generate(true, "No Data Found", 404, null);                
                        reject(apiResponse);
                    } else {
                        //let receiverName=userDetails.firstName+" "+userDetails.lastName;

                        let temp={
                            friendId:req.body.friendId,
                            friendName:req.body.friendName
                        }
                        userDetails.friends.push(temp);

                        userDetails.save((err, users)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Save action failed", 500, null); 
                                reject(apiResponse);
                            } else {                               
                                resolve(users);
                            }
                        })
                    }
                })
        })
    }
//append friend request acceptor/receiver data in sender/requestor user data

    let appendUserData=(users)=>{
        console.log(users);
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':req.body.friendId})
                .exec((err, friendDetails)=>{
                    if(err){
                        //console.log("FunctionsLib::acceptFriendRequest " + err);
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                
                        reject(apiResponse);
                    } else if(check.isEmpty(friendDetails)){
                        //console.log("FunctionsLib::acceptFriendRequest " + "No Data found");
                        let apiResponse=response.generate(true, "No Data Found", 404, null);                
                        reject(apiResponse);
                    } else {

                        let temp={
                            friendId:req.body.userId,
                            friendName:req.body.userName
                        }
                        friendDetails.friends.push(temp);

                        friendDetails.save((err, friend)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Save action failed", 500, null); 
                                reject(apiResponse);
                            } else {                               
                                resolve(friend);
                            }
                        })
                    }
                })
        })
    }

    appendFriendData()
        .then(appendUserData)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "friends data updated successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch(err=>{
            let apiResponse=response.generate(true, "friends data updation failed", 500, err);
            res.send(apiResponse);
        });    
}


//-----------------------------------------Definition ended----------------------------------------------
//export all above functions 
module.exports={
    signupFunction:signupFunction,
    loginFunction:loginFunction,
    logoutFunction:logoutFunction,
    demandOTP:demandOTP,
    matchOTP:matchOTP,
    resetPassword:resetPassword,
    getFriendList:getFriendList,
    acceptFriendRequest:acceptFriendRequest,
    getContactList:getContactList
}
//------------------------------------------
