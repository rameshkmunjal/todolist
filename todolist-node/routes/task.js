//routes/task.js
const express=require('express');
const app= express();
const taskController=require('./../controllers/taskController');
const appConfig=require('./../config/appConfig');
const auth=require('./../middlewares/auth');

let setRouter=(app)=>{
    let baseUrl=appConfig.apiVersion+"/todolist";
    console.log(baseUrl);
    //get request handling routes    
    app.get(baseUrl+'/single-list/:listId', taskController.getListById);    
}

module.exports={
    setRouter:setRouter
}