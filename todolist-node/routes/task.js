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
    app.get(baseUrl+'/:authToken/all-notifications/:userId', auth.isAuthorised, taskController.getAllNotifications);     
    app.get(baseUrl+'/:authToken/notifications/:userId', auth.isAuthorised, taskController.getLatestNotification); 
    //post request handling routes 
    app.post(baseUrl+'/:authToken/create-list/:userId', auth.isAuthorised,  taskController.createList);
    app.post(baseUrl+'/:authToken/delete-list', auth.isAuthorised,  taskController.deleteList); 
    app.post(baseUrl+'/:authToken/edit-list', auth.isAuthorised,  taskController.editList); 
    //app.post(baseUrl+'/:authToken/create-notification/:userId', auth.isAuthorised,  taskController.createNotification);        
    //this.http.post(`${this.url}/${authToken}/change-status-list`, params);
    app.post(baseUrl+'/:authToken/change-status-list', auth.isAuthorised,  taskController.changeStatusList);
    //return this.http.post(`${this.url}/${authToken}/undo-list`, params)
    app.post(baseUrl+'/:authToken/undo-create-list', auth.isAuthorised,  taskController.undoCreateList);
    app.post(baseUrl+'/:authToken/undo-edit-list', auth.isAuthorised,  taskController.undoEditList);
    app.post(baseUrl+'/:authToken/undo-delete-list', auth.isAuthorised,  taskController.undoDeleteList);

    app.get(baseUrl+'/:authToken/items-by-listId/:userId/:listId', auth.isAuthorised, taskController.getItemsByListId);
    app.post(baseUrl+'/:authToken/create-item/:userId', auth.isAuthorised, taskController.createItem);
    app.post(baseUrl+'/:authToken/edit-item/:userId', auth.isAuthorised, taskController.editItem);
    app.post(baseUrl+'/:authToken/delete-item/:userId', auth.isAuthorised, taskController.deleteItem);
    app.post(baseUrl+'/:authToken/change-item-status/:userId', auth.isAuthorised, taskController.changeItemStatus);
    app.post(baseUrl+'/:authToken/undo-create-item', auth.isAuthorised,  taskController.undoCreateItem);
    app.post(baseUrl+'/:authToken/undo-delete-item', auth.isAuthorised,  taskController.undoDeleteItem);
    app.post(baseUrl+'/:authToken/undo-edit-item', auth.isAuthorised,  taskController.undoEditItem);

    app.get(baseUrl+'/:authToken/sub-items-by-itemId/:userId/:itemId', auth.isAuthorised, taskController.getSubItemsByItemId);
    app.post(baseUrl+'/:authToken/create-sub-item/:userId', auth.isAuthorised, taskController.createSubItem);
    
    app.post(baseUrl+'/:authToken/edit-sub-item/:userId', auth.isAuthorised, taskController.editSubItem);
    app.post(baseUrl+'/:authToken/delete-sub-item/:userId', auth.isAuthorised, taskController.deleteSubItem);
    
    app.post(baseUrl+'/:authToken/change-sub-item-status/:userId', auth.isAuthorised, taskController.changeSubItemStatus);
    
    app.post(baseUrl+'/:authToken/undo-create-sub-item', auth.isAuthorised,  taskController.undoCreateSubItem);
    app.post(baseUrl+'/:authToken/undo-delete-sub-item', auth.isAuthorised,  taskController.undoDeleteSubItem);

    app.post(baseUrl+'/:authToken/undo-edit-sub-item', auth.isAuthorised,  taskController.undoEditSubItem);

}

module.exports={
    setRouter:setRouter
}