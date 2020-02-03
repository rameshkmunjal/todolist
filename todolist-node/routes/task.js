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
    //app.get(baseUrl+'/:authToken/allLists/:userId', auth.isAuthorised, taskController.getAllLists);
    //this.http.get(`${this.url}/${authToken}/allTasks/${userId}`);
    app.get(baseUrl+'/single-list/:listId', taskController.getListById);
    //post request handling routes
   // app.post(baseUrl+'/create', taskController.createTask);
    //app.put(baseUrl+"/editTask/:taskId", taskController.editTask);
    //app.post(baseUrl+"/deleteTask", taskController.deleteTask);
}

module.exports={
    setRouter:setRouter
}