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
    app.get(baseUrl+'/:authToken/all-lists/:userId', auth.isAuthorised,  taskController.getAllListsByUserId);    
    app.get(baseUrl+'/:authToken/notifications/:userId', auth.isAuthorised, taskController.getNotificationList); 
    //post request handling routes 
    app.post(baseUrl+'/:authToken/create-list/:userId', auth.isAuthorised,  taskController.createList);
    app.post(baseUrl+'/:authToken/delete-list', auth.isAuthorised,  taskController.deleteList); 
    app.post(baseUrl+'/:authToken/edit-list', auth.isAuthorised,  taskController.editList); 
    //app.post(baseUrl+'/:authToken/create-notification/:userId', auth.isAuthorised,  taskController.createNotification);        
    //this.http.post(`${this.url}/${authToken}/change-status-list`, params);
    app.post(baseUrl+'/:authToken/change-status-list', auth.isAuthorised,  taskController.changeStatusList);
    //return this.http.post(`${this.url}/${authToken}/undo-list`, params)
    app.post(baseUrl+'/:authToken/undo-create-list', auth.isAuthorised,  taskController.undoCreateList);
    app.post(baseUrl+'/:authToken/undo-delete-list', auth.isAuthorised,  taskController.undoDeleteList);

}

module.exports={
    setRouter:setRouter
}