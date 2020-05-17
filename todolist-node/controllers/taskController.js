//including packages
const mongoose=require('mongoose');
const shortId=require('shortid');
//including files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');
const utility=require('./../libs/utilityLib');

//including model
require('./../models/user');
const UserModel=mongoose.model('User');
require('./../models/list');
const ListModel=mongoose.model('List');
require('./../models/listitem');
const ItemModel=mongoose.model('listitem');
require('./../models/subitem');
const SubItemModel=mongoose.model('subItem');
require('./../models/notification');
const NotificationModel=mongoose.model('notification');

const task=require('./taskFunctions');

let getAllListsByUserId=(req, res)=>{
    ListModel.find({'creatorId':req.params.userId, 'isActive':true})
        .exec((err, allLists)=>{
            if(err){
                let apiResponse=response.generate(true, "getAllListsByUserId: list fetching failed", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(allLists)){
                let apiResponse=response.generate(true, "getAllListsByUserId: No Data found", 404, null);
                res.send(apiResponse);
            } else{
                let apiResponse=response.generate(false, "getAllListsByUserId: list data fetched successfully", 200, allLists);
                res.send(apiResponse);
            }
        })
}
//-------------------------
//----------------------------------------------------------------------------------------
let getItemsByListId=(req, res)=>{
    console.log("---------------req.body---------------");
    console.log(req.body);
    ItemModel.find({'listId':req.params.listId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occured", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                res.send(apiResponse);
            } else {
                //res.send(result);
                let apiResponse=response.generate(false, "Items of a List fetched successfully", 200, result);
                res.send(apiResponse);
            }
        })
}
//-----------------------------------------------------
let getSubItemsByItemId=(req, res)=>{
    console.log("inside getSubItemsByItemId......");
    console.log(req.params.userId);
    console.log(req.params.itemId);
    SubItemModel.find({'itemId':req.params.itemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occured", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                res.send(apiResponse);
            } else {
                //res.send(result);
                let apiResponse=response.generate(false, "Sub Items of an Item fetched successfully", 200, result);
                res.send(apiResponse);
            }
        })
}
//---------------------------------------create - api -----------------------------------
let createList=(req, res)=>{   
  task.create_list(req, res)
    .then(task.create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        console.log(apiResponse);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })
}

let createItem=(req, res)=>{
    task.create_item(req)
    .then(task.create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })
}

let createSubItem=(req, res)=>{    
    task.create_sub_item(req)
    .then(task.create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })
}
//----------------------------edit - api ----------------------------------------------
let editList=(req, res)=>{    
    task.saveOldList(req, res)
        .then(task.createNewList)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List edited and notification sent successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{                               
            res.send(err);
        })
}
//-------------------------------------------------------------------------------
let editItem=(req, res)=>{    
    task.saveOldItem(req, res)
        .then(task.createNewItem)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item edited and notification sent successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{                               
            res.send(err);
        })
}
//-----------------------------------------------------------------------------
let editSubItem=(req, res)=>{        
    task.saveOldSubItem(req, res)
        .then(task.createNewSubItem)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Sub Item edited and notification sent successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{                               
            res.send(err);
        })
}
//--------------------------delete - api---------------------------------------------
let deleteList=(req, res)=>{
    task.delete_list(req, res)
    .then(task.create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })    
}

let deleteItem=(req, res)=>{ 
    task.delete_item(req, res)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "item deleted successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            console.log(err);
        })
}

let deleteSubItem=(req, res)=>{ 
    task.delete_sub_item(req, res)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "item deleted successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            console.log(err);
        })
}
//----------------------------------change status - api ------------------------------------------------
let changeStatusList=(req, res)=>{
    task.change_status_list(req, res)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}

let changeItemStatus=(req, res)=>{
    task.change_item_status(req, res)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}

let changeSubItemStatus=(req, res)=>{
    task.change_sub_item_status(req, res)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Sub Item Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })        
}    
//-----------------------------undoCreate - api ------------------------------------------------------------
let undoCreateList=(req, res)=>{    
    task.deactivateNotification(req, res)
        .then(task.deactivateList)        
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Create List undone successfully", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })          
}

let undoCreateItem=(req, res)=>{    
    task.deactivateNotification(req, res)
        .then(task.deactivateItem)        
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Create Item undone successfully", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })          
}
let undoCreateSubItem=(req, res)=>{    
    task.deactivateNotification(req, res)
        .then(task.deactivateSubItem)        
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Create Item undone successfully", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })              
}
//--------------------------undoEdit - api-------------------------------------------
let undoEditList=(req, res)=>{
    console.log("undoEditList api function");
    task.deactivateNotification(req, res)
        .then(task.deactivateList)
        .then(task.activateList)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List edit undone successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{ res.send(err);})
}
let undoEditItem=(req, res)=>{
    console.log("undoEditItem api function");
    task.deactivateNotification(req, res)
        .then(task.deactivateItem)
        .then(task.activateItem)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item edit undone successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{ res.send(err);})
}
let undoEditSubItem=(req, res)=>{
    console.log("undoEditSubItem api function");
    task.deactivateNotification(req, res)
        .then(task.deactivateSubItem)
        .then(task.activateSubItem)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Sub Item edit undone successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{ res.send(err);})
}
//-----------------------------undo delete - api--------------------------------------------
let undoDeleteList=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.activateList)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Delete List undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
let undoDeleteItem=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.activateItem)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Delete Item undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
let undoDeleteSubItem=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.activateSubItem)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Delete Item undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//------------------------------------------------------------------------------------
let getAllNotifications=(req, res)=>{       
    get_Friend_List(req, res)
        .then(getNotifications)
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "All Notifications fetched successfully", 200, resolve);            
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//---------------------------------------------------------------------------------------------------
let getLatestNotification=(req, res)=>{       
    get_Friend_List(req, res)
        .then(getNotifications)
        .then((resolve)=>{            
            let latestNotification=resolve[0];            
            let apiResponse=response.generate(false, "Latest Notifications fetched successfully", 200, latestNotification);            
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//---------------------------------------------------------------------------------------------------

let get_Friend_List=(req, res)=>{
    return new Promise((resolve, reject)=>{
        UserModel.findOne({'userId':req.params.userId})
            .exec((err, result)=>{
                if(err){
                    //console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    //console.log("No Data found");
                    let apiResponse=response.generate(true, "No Data Found", 404, null);
                    reject(apiResponse);
                } else {
                    //console.log("88888888888888");
                    //console.log(result);
                    //console.log("88888888888888");
                    req.friendList=result.friends;
                    resolve(req);
                }

        })
    })
}
let getNotifications=(req)=>{    
    return new Promise((resolve, reject)=>{
        NotificationModel.find({'isActive':true})
            .exec((err, notifications)=>{
        if(err){
            //console.log("getNotificationList:Some Error Occurred");
            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
            reject(apiResponse);
        } else if(check.isEmpty(notifications)){
            //console.log("getNotificationList:No Data found");
            let apiResponse=response.generate(true, "No Data found", 404, null);
            reject(apiResponse);
        } else {
            //console.log("getNotificationList: api success");
            let allNotifications=[];

            let friendList=req.friendList;
            for(let i=0; i<friendList.length; i++){
                for(let j=0; j<notifications.length; j++){
                    if(friendList[i].friendId===notifications[j].sendId){
                        allNotifications.push(notifications[j]);                        
                    }
                }
            }
            allNotifications=utility.getSortedDescending(allNotifications);            
            //console.log("^^^^^^^^^^^^^^^^^^^");
            resolve(allNotifications);
        }
      })
    })
}
//----------------------------------------------------------------------------------------------------------    
module.exports={
    createList:createList,
    deleteList:deleteList, 
    editList:editList,
    changeStatusList:changeStatusList,
    undoCreateList:undoCreateList, 
    undoDeleteList:undoDeleteList,
    undoEditList:undoEditList,  
    getAllListsByUserId:getAllListsByUserId,
    getAllNotifications:getAllNotifications,
    getLatestNotification:getLatestNotification,

    getItemsByListId:getItemsByListId,
    createItem:createItem,
    editItem:editItem,
    deleteItem:deleteItem,
    changeItemStatus:changeItemStatus,
    undoCreateItem:undoCreateItem,
    undoDeleteItem:undoDeleteItem,
    undoEditItem:undoEditItem,
    
    getSubItemsByItemId:getSubItemsByItemId,
    createSubItem:createSubItem,
    editSubItem:editSubItem,
    deleteSubItem:deleteSubItem,
    changeSubItemStatus:changeSubItemStatus,
    undoCreateSubItem:undoCreateSubItem,
    undoDeleteSubItem:undoDeleteSubItem,
    undoEditSubItem:undoEditSubItem
}