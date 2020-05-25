//including packages
const mongoose=require('mongoose');
const shortId=require('shortid');
//including files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');


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
//including function file
const task=require('./taskFunctions');

//-----------------------api calls - to get all lists/items/sub-items---------------------
//to get all active lists of a user
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

//to get all active items of a list
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

//to get all active sub items of a item
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
//----------------------------create - list/item/sub-item-----------------------------------
//to create a list
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
//to create an item
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
//to create a sub item
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
//----------------------------edit - list/item/sub-item ----------------------------------------------
//to edit a list
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

//to edit an item
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

//to edit a sub item
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
//--------------------------api calls - to delete list/item/sub-item------------------------
//to delete a list
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
//to delete an item
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
//to delete a sub item
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
//------------------api calls - to change status of list/item/sub-item----------------------
//to change status of list
let changeStatusList=(req, res)=>{
    task.change_status_list(req)
        .then(task.create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//to change status of item
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
//to change status of sub item
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
//----------------------api call to undoCreate - list/item/sub-item ---------------------------------
//to undo create list
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
//to undo create item
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
//to undo create sub item
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
//--------------api calls - undo edit list/item/sub-item----------------------------
//to undo edit list
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
//to undo edit item
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
//to undo edit sub item
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
//-----------------api calls - to undo delete list/item/sub-item-----------------
//undo delete list
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
//undo delete item
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
//undo delete sub item
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
//---------------------api calls - notification realted-----------------------------------------------
//get all notifications of changes made by user's friends 
let getAllNotifications=(req, res)=>{       
    task.get_Friend_List(req, res)
        .then(task.getNotifications)
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "All Notifications fetched successfully", 200, resolve);            
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//to get latest notification of change made by user friend
let getLatestNotification=(req, res)=>{       
    task.get_Friend_List(req, res)
        .then(task.getNotifications)
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
let undoChangeStatusList=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.change_status_list)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List status Change undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })

}
 
let undoChangeStatusItem=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.change_item_status)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item status Change undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
}

let undoChangeStatusSubItem=(req, res)=>{
    task.deactivateNotification(req, res)
        .then(task.change_sub_item_status)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item status Change undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
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
    undoChangeStatusList:undoChangeStatusList,

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
    undoChangeStatusItem:undoChangeStatusItem,    
    
    getSubItemsByItemId:getSubItemsByItemId,

    createSubItem:createSubItem,
    editSubItem:editSubItem,
    deleteSubItem:deleteSubItem,
    changeSubItemStatus:changeSubItemStatus,
    undoCreateSubItem:undoCreateSubItem,
    undoDeleteSubItem:undoDeleteSubItem,
    undoEditSubItem:undoEditSubItem,
    undoChangeStatusSubItem:undoChangeStatusSubItem
}