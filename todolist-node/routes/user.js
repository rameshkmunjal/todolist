//including packages
const express=require('express');
const app=express();
//including files
const userController=require('./../controllers/userController');
const appConfig=require('./../config/appConfig');   
const auth=require('./../middlewares/auth');

let setRouter=(app)=>{
    let baseUrl=appConfig.apiVersion+"/todolist";
    //post request handling routes
    app.post(baseUrl+'/sign-up', userController.signupFunction);
    app.post(baseUrl+'/login', userController.loginFunction);
    app.post(baseUrl+`/:authToken/logout`, auth.isAuthorised, userController.logoutFunction);   
      
    app.post(baseUrl+'/matchOTP/:userId', userController.matchOTP);    
    app.post(baseUrl+'/resetPassword/:email/:code', userController.resetPassword);
    app.post(baseUrl+'/:authToken/acceptFriend/:userId', auth.isAuthorised, userController.acceptFriendRequest);
    //get request handling routes
    app.get(baseUrl+'/demandOTP/:email', userController.demandOTP);
    app.get(baseUrl+'/:authToken/getfriendlist/:userId',auth.isAuthorised,  userController.getFriendList);
    app.get(baseUrl+'/:authToken/contacts/:userId',auth.isAuthorised,  userController.getContactList);   
    
}
//expoting setRouter function
module.exports={
    setRouter:setRouter
}
