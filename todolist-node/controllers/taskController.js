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


let createList=(req, res)=>{ 
   
  create_list(req, res)
    .then(create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })
}
//-------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
let editList=(req, res)=>{
    
    saveOldList(req, res)
        .then(createNewList)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List edited and notification sent successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{                               
            res.send(err);
        })
}
//----------------------------------------------------------------------------------------------------------
let getAllNotifications=(req, res)=>{
    //console.log("*******************5397397539********************");    
    get_Friend_List(req, res)
        .then(getNotifications)
        .then((resolve)=>{
            //console.log("$$$$$$$$$$$$$$$$$$$$");
            //console.log(resolve);
            let apiResponse=response.generate(false, "All Notifications fetched successfully", 200, resolve);
            //console.log(apiResponse);
            //console.log("$$$$$$$$$$$$$$$$$$$$");
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//---------------------------------------------------------------------------------------------------
let getLatestNotification=(req, res)=>{
    //console.log("*********************999********************");    
    get_Friend_List(req, res)
        .then(getNotifications)
        .then((resolve)=>{
            //console.log("$$$$$$$$$$$$$$$$$$$$");
            let latestNotification=resolve[0];            
            let apiResponse=response.generate(false, "Latest Notifications fetched successfully", 200, latestNotification);
            //console.log(apiResponse);
            //console.log("$$$$$$$$$$$$$$$$$$$$");
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//---------------------------------------------------------------------------------------------------
let changeStatusList=(req, res)=>{
    change_status_list(req, res)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
    
}
//-----------------------------undoCreateList------------------------------------------------------------
let undoCreateList=(req, res)=>{    
    deactivateNotification(req, res)
        .then(deactivateList)        
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Create List undone successfully", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        }) 
          
}
//--------------------------------------------------------------------------------------------------------------
let undoDeleteList=(req, res)=>{
    deactivateNotification(req, res)
        .then(activateList)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Delete List undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//-----------------------------------------------------------------------------------------------
let undoEditList=(req, res)=>{
    console.log("undoEditList api function");
    deactivateNotification(req, res)
        .then(deactivateList)
        .then(activateList)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List edit undone successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{ res.send(err);})
}
    //----------------------------------------------------------------------------------------------------------

//--------------------------deactivate notification----------------------------------------------
let deactivateNotification=(req, res)=>{    
    return new Promise((resolve, reject)=>{   
        //console.log(req.body.notificationId);
        NotificationModel.findOne({'id': req.body.notificationId})
            .exec((err, result)=>{
                if(err){
                    //console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                    //res.send(apiResponse);
                } else if(check.isEmpty(result)){
                    //console.log("No Data found");
                    let apiResponse=response.generate(true, "No Notif Data found", 404, null);
                    reject(apiResponse);
                    //res.send(apiResponse);
                } else {
                    result.isActive=false;
                    result.save((err, editedNotif)=>{
                        if(err){
                            //console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                            //res.send(apiResponse);
                        } else{ 
                            console.log(editedNotif); 
                            //let obj=editedNotif.toObject();
                            req.refId=req.body.id;
                            req.action=editedNotif.action;
                            console.log("refId : "+req.refId);
                            console.log("req.action : "+req.action);                                                      
                            resolve(req);
                        }
                    })
                }
            })
    })

}
//-----------------------------------deactivate list-------------------------------------------
let deactivateList=(req)=>{
    console.log("refId in deactivateList : "+req.refId);
    return new Promise(function(resolve, reject){
        //console.log("************************** List id is : "+ JSON.stringify(notif.id));
        ListModel.findOne({'listId':req.refId})
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
                    result.isActive=false;
                    result.save((err, newList)=>{
                        if(err){
                            //console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            let list = newList.toObject();
                            list.refId=list.refkey; 
                            console.log(list);                           
                            resolve(list);
                        }
                    })//save method ended
                }//else block ended
            })//exec method ended
    });//Promise ended    
}//function deactivateList ended
//---------------------------------------activate list----------------------------------------------
let activateList=(obj)=>{
    console.log("refId in activateList : " + obj.refId);
    return new Promise((resolve, reject)=>{
        ListModel.findOne({'listId':obj.refId})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "No List Data Found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=true;
                    result.save((err, newList)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            console.log("activate list : save method ");4
                            console.log(newList);
                            resolve(newList);
                        }
                    })//save method ended
                }//else block ended
            })//exec method ended
    })//Promise ended
}//function deactivateList ended
//---------------------------------create list--------------------------------------------------
let create_list=(req)=>{
    return new Promise((resolve, reject)=>{
        let randomId=shortId.generate();
        let newList=new ListModel({
            listId:randomId,        
            listName:req.body.listName,
            createdOn:Date.now(),
            creatorId:req.body.creatorId,
            createdBy:req.body.createdBy,
            originId:randomId,
            refkey:randomId                  
        })

        newList.save((err, list)=>{
            if(err){            
                let apiResponse=response.generate(true, "List creation - save action failed", 500, null);
                reject(apiResponse);
            } else {
                let listObj=list.toObject();
                delete listObj._id;
                delete listObj.__v; 
                
                let obj={
                    type:"list",
                    action:"create",
                    typeId:listObj.listId,
                    refkey:listObj.refkey,
                    message:"List "+listObj.listName+"  created by "+listObj.createdBy,
                    creatorId:listObj.creatorId,
                    createdBy:listObj.createdBy
                }

                resolve(obj);
            }
        })
    })
  } 
  //---------------------------------delete_list------------------------------------------------
  let delete_list=(req, res)=>{
    return new Promise((resolve, reject)=>{
        ListModel.findOne({'listId':req.body.listId})
            .exec((err, result)=>{
                if(err){
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    let apiResponse=response.generate(true, "No Data found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=false;
                    result.changeBy=req.body.changeBy;
                    result.changeOn=new Date();
                    result.personId=req.body.changeId;
                    
                    //console.log("deleted List" + JSON.stringify(result));
                    result.save((err, list)=>{
                        if(err){
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else { 
                            let listObj=list.toObject();
                            delete listObj._id;
                            delete listObj.__v; 
                            
                            let obj={
                                type:"list",
                                action:"delete",
                                typeId:listObj.listId,
                                refkey:listObj.refkey,
                                message:"List "+listObj.listName+"  deleted by "+listObj.changeBy,
                                creatorId:listObj.personId,
                                createdBy:listObj.changeBy
                            } 
                           
                            resolve(obj);
                        }
                    })  //save method ended              
                }//else block ended
            })//exec method ended
        })//Promise ended
    }//delete_list ended  
  //---------------------------------create notification----------------------------------------
  let create_Notification=(obj)=>{
    return new Promise((resolve, reject)=>{
        let newNotice=new NotificationModel({
            id:shortId.generate(),
            type:obj.type,
            action:obj.action,
            typeId:obj.typeId,
            name:obj.name,
            refkey:obj.refkey,            
            message:obj.message,
            sendId:obj.creatorId,
            sendName:obj.createdBy, 
            createdOn:new Date()
        })
    
        newNotice.save((err, saveNotice)=>{
            if(err){            
                let apiResponse=response.generate(true, "Notification creation failed", 500, null);
                reject(apiResponse);
            } else {            
                let notice=saveNotice.toObject();
                delete notice._id;
                delete notice.__v; 
                if(notice.type==="item"){
                    notice.listId=obj.listId
                } else if(notice.type==="subItem"){
                    notice.listId=obj.itemId
                }
                resolve(notice);
                
            }
        })
    })    
  }
  //------------------------------delete list--------------------------------------------------
  let deleteList=(req, res)=>{
    delete_list(req, res)
    .then(create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })    
}
//-------------------------------------edit list------------------------------------------------------
let saveOldList=(req, res)=>{
    //console.log("*************Save Old List****************");
    return new Promise((resolve, reject)=>{
    ListModel.findOne({'listId':req.body.listId, 'isActive':true})
     .exec((err, oldList)=>{
        if(err){
            //console.log("undoEditList  " + JSON.stringify(err));
            let apiResponse=response.generate(true, "Undo Edit action failed after deletion", 500, null);
            reject(apiResponse);
        } else if(check.isEmpty(oldList)){
            //console.log("undoEditList " + "No Data found");
            let apiResponse=response.generate(true, "No data found", 404, null);
            reject(apiResponse);
        } else {
            //console.log("old list saved");                
            oldList.isActive=false;                                   
        
            oldList.save((err, oldListData)=>{
                if(err){
                    //console.log("undoEditList " + JSON.stringify(err));
                    let apiResponse=response.generate(true, "Save old list action failed", 500, null);
                    reject(apiResponse);
                } else {
                    //console.log("old list saved : else block");
                    let obj={
                        oldListData:oldListData,
                        reqBody:req.body
                    }                         
                    resolve(obj);
                }//else ended                        
            })//save method ended
        } //else of exec method ended
    })//exec method ended
})//Promise ended
}

let createNewList=(obj)=>{
    return new Promise((resolve, reject)=>{
        let newList=new ListModel({ 
            listId:shortId.generate(),               
            listName:obj.reqBody.listName,
            createdOn:obj.oldListData.createdOn,
            creatorId:obj.oldListData.creatorId,
            createdBy:obj.oldListData.createdBy,
            changeOn:Date.now(),                
            changeBy:obj.reqBody.changeName,
            personId:obj.reqBody.changeId,
            originId:obj.oldListData.originId,
            refkey:obj.oldListData.listId
        })

        newList.save((err, savedList)=>{
            if(err){
                //console.log("FunctionsLib " + err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                   
                reject(apiResponse);
            } else {
                let editedList=savedList.toObject();
                delete editedList._id;
                delete editedList.__v;
                let newObj={
                    type:"list",
                    action:"edit",
                    typeId:editedList.listId,
                    refkey:editedList.refkey,
                    message:"List "+editedList.listName+"  edited by "+obj.reqBody.changeName,
                    creatorId:obj.reqBody.changeId,
                    createdBy:obj.reqBody.changeName
                }                
                resolve(newObj);
            }
        })
    })        
}

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
//------------------------------------------------------------------------------------------------------------------
let change_status_list=(req, res)=>{
    return new Promise((resolve, reject)=>{
        ListModel.findOne({'listId':req.body.listId})
    .exec((err, result)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "Some error occured", 500, null);
            reject(apiResponse);
        } else if(check.isEmpty(result)){
            //console.log("No Data found");
            let apiResponse=response.generate(true, "No Data found", 404, null);
            reject(apiResponse);
        } else {
            if(result.status==="open"){
                result.status="done"
            } else if(result.status==="done") {
                result.status="open"
            }
            result.changeOn=Date.now();
            result.changeBy=req.body.changeName;
            result.personId=req.body.userId;

            result.save((err, list)=>{
                if(err){
                    //console.log(err);
                } else {
                    let listObj=list.toObject();
                    delete listObj._id;
                    delete listObj.__v;
                    //listObj.action=req.body.action;
                    //listObj.type=req.body.type;
                    let obj={
                        type:"list",
                        action:"status-change",
                        typeId:listObj.listId,
                        refkey:refkey,
                        message:"List "+listObj.listName+"  status changed by "+listObj.createdBy,
                        creatorId:listObj.creatorId,
                        createdBy:listObj.createdBy
                    }                        
                    resolve(obj);
                }
            })
        }
    })

    })
}
//----------------------------------------------------------------------------------------
let getItemsByListId=(req, res)=>{
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

let createItem=(req, res)=>{
    create_item(req)
    .then(create_Notification)
    .then((resolve)=>{
        let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        res.send(err);
    })
}

let create_item=(req)=>{
    return new Promise((resolve, reject)=>{
        let randomId=shortId.generate();
        let newItem=new ItemModel({
            itemId:randomId,        
            itemName:req.body.itemName,
            listId:req.body.listId,
            createdOn:Date.now(),
            creatorId:req.body.creatorId,
            createdBy:req.body.createdBy,
            originId:randomId,
            refkey:randomId                  
        })

        newItem.save((err, item)=>{
            if(err){            
                let apiResponse=response.generate(true, "Item creation - save action failed", 500, null);
                reject(apiResponse);
            } else {
                let itemObj=item.toObject();
                delete itemObj._id;
                delete itemObj.__v; 
                
                let obj={
                    type:"item",
                    action:"create",
                    typeId:itemObj.itemId,
                    name:itemObj.itemName,
                    listId:itemObj.listId,
                    refkey:itemObj.refkey,
                    message:"Item "+itemObj.itemName+"  created by "+itemObj.createdBy,
                    creatorId:itemObj.creatorId,
                    createdBy:itemObj.createdBy
                }
                resolve(obj);
            }
        })
    })
}

let deleteItem=(req, res)=>{ 
    delete_item(req, res)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "item deleted successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            console.log(err);
        })
}

let delete_item=(req, res)=>{
    console.log("*********************");
    console.log(req.body.changeBy);
    return new Promise((resolve, reject)=>{
        ItemModel.findOne({'itemId':req.body.itemId})
            .exec((err, result)=>{
                if(err){
                    let apiResponse=response.generate(true, "delete_item function::Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    let apiResponse=response.generate(true, "delete_item function::No Data found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=false;
                    result.changeBy=req.body.changeBy;
                    result.changeOn=new Date();
                    result.personId=req.body.changeId;
                    
                    //console.log("deleted List" + JSON.stringify(result));
                    result.save((err, item)=>{
                        if(err){
                            let apiResponse=response.generate(true, "delete_item function::Save method::Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else { 
                            let itemObj=item.toObject();
                            delete itemObj._id;
                            delete itemObj.__v; 
                            
                            let obj={
                                type:"item",
                                action:"delete",
                                typeId:itemObj.itemId,
                                listId:itemObj.listId,
                                refkey:itemObj.refkey,
                                message:"Item "+itemObj.itemName+"  deleted by "+itemObj.changeBy,
                                creatorId:itemObj.personId,
                                createdBy:itemObj.changeBy
                            } 
                           
                            resolve(obj);
                        }
                    })  //save method ended              
                }//else block ended
            })//exec method ended
        })//Promise ended
    }//delete_list ended  

let deactivateItem=(req)=>{       
    return new Promise((resolve, reject)=>{
        ItemModel.findOne({'itemId':req.body.id})
        .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Some error occured", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "deactivateItem function::No data found", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, item)=>{
                    if(err){
                        console.log("error in saving item");
                        let apiResponse=response.generate(true, "Some error occured", 500, null);
                        reject(apiResponse);
                    } else {
                        let itemObj=item.toObject();
                        delete itemObj._id;
                        delete itemObj.__v; 
                        
                        resolve(itemObj);
                    }
                })
            }
        })

    })    
}
let activateItem=(obj)=>{
    console.log("refId in activateItem : " + obj.refkey);
    return new Promise((resolve, reject)=>{
        ItemModel.findOne({'itemId':obj.refkey})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "activateItem::Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "activateItem::No List Data Found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=true;
                    result.save((err, newItem)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "activateItem::Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            console.log("activateItem :: save method ");
                            console.log(newItem);
                            resolve(newItem);
                        }
                    })//save method ended
                }//else block ended
            })//exec method ended
    })//Promise ended
}//function activateItem ended
//---------------------------------create list--------------------------------------------------
//---------------------------------------------------------------------------------------------------------
let editItem=(req, res)=>{
    
    saveOldItem(req, res)
        .then(createNewItem)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item edited and notification sent successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{                               
            res.send(err);
        })
}

let saveOldItem=(req, res)=>{
    //console.log("*************Save Old List****************");
    return new Promise((resolve, reject)=>{
    ItemModel.findOne({'itemId':req.body.itemId, 'isActive':true})
     .exec((err, oldItem)=>{
        if(err){
            //console.log("undoEditList  " + JSON.stringify(err));
            let apiResponse=response.generate(true, "Undo Edit action failed after deletion", 500, null);
            reject(apiResponse);
        } else if(check.isEmpty(oldItem)){
            console.log("saveOldItem::editItem " + "No Data found");
            let apiResponse=response.generate(true, "No data found", 404, null);
            reject(apiResponse);
        } else {
            console.log("old list saved");                
            oldItem.isActive=false;                                   
        
            oldItem.save((err, oldItemData)=>{
                if(err){
                    console.log("undoEditList " + JSON.stringify(err));
                    let apiResponse=response.generate(true, "Save old list action failed", 500, null);
                    reject(apiResponse);
                } else {
                    console.log("old list saved : else block");
                    let obj={
                        oldItemData:oldItemData,
                        reqBody:req.body
                    }                         
                    resolve(obj);
                }//else ended                        
            })//save method ended
        } //else of exec method ended
    })//exec method ended
})//Promise ended
}

let createNewItem=(obj)=>{
    console.log("inside createNewItem function");
    return new Promise((resolve, reject)=>{
        let newItem=new ItemModel({ 
            itemId:shortId.generate(),               
            itemName:obj.reqBody.itemName,
            listId:obj.reqBody.listId,
            createdOn:obj.oldItemData.createdOn,
            creatorId:obj.oldItemData.creatorId,
            createdBy:obj.oldItemData.createdBy,
            changeOn:Date.now(),                
            changeBy:obj.reqBody.changeName,
            personId:obj.reqBody.changeId,
            originId:obj.oldItemData.originId,
            refkey:obj.oldItemData.itemId
        })

        
            

        newItem.save((err, savedItem)=>{
            if(err){
                console.log("createNewItem::editItem function " + err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                   
                reject(apiResponse);
            } else {
                console.log("createNewItem::editItem function :saveItem " + savedItem);
                let editedItem=savedItem.toObject();
                delete editedItem._id;
                delete editedItem.__v;
                let newObj={
                    type:"item",
                    action:"edit",
                    typeId:editedItem.itemId,
                    listId:editedItem.listId,
                    refkey:editedItem.refkey,
                    message:"Item "+editedItem.itemName+"  edited by "+obj.reqBody.changeName,
                    creatorId:obj.reqBody.changeId,
                    createdBy:obj.reqBody.changeName
                }                                
                resolve(newObj);
            }
        })
    })
}

//----------------------------------------------------------------------------------------------------------
let changeItemStatus=(req, res)=>{
    change_item_status(req, res)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item Status Changed Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
    
}
let change_item_status=(req, res)=>{
    return new Promise((resolve, reject)=>{
        ItemModel.findOne({'itemId':req.body.itemId})
    .exec((err, result)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "Some error occured", 500, null);
            reject(apiResponse);
        } else if(check.isEmpty(result)){
            //console.log("No Data found");
            let apiResponse=response.generate(true, "No Data found", 404, null);
            reject(apiResponse);
        } else {
            if(result.status==="open"){
                result.status="done"
            } else if(result.status==="done") {
                result.status="open"
            }
            result.changeOn=Date.now();
            result.changeBy=req.body.changeName;
            result.personId=req.body.userId;

            result.save((err, item)=>{
                if(err){
                    //console.log(err);
                } else {
                    console.log("444444444444444");
                    console.log(item);
                    let itemObj=item.toObject();
                    delete itemObj._id;
                    delete itemObj.__v;
                    
                    let obj={
                        type:"item",
                        action:"status-change",
                        typeId:itemObj.itemId,
                        listId:itemObj.listId,
                        refkey:itemObj.refkey,
                        message:"Item "+itemObj.itemName+"  status changed by "+itemObj.createdBy,
                        creatorId:itemObj.creatorId,
                        createdBy:itemObj.createdBy
                    }                        
                    resolve(obj);
                }
            })
        }
    })

    })
}
//----------------------------------------------------------------------------------------
/*
let activateItem=(obj)=>{
    console.log("refId in activateItem : " + obj.refId);
    return new Promise((resolve, reject)=>{
        ItemModel.findOne({'itemId':obj.refId})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "No Item Data Found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=true;
                    result.save((err, newItem)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            console.log("activateItem function : save method ");4
                            console.log(newItem);
                            resolve(newItem);
                        }
                    })//save method ended
                }//else block ended
            })//exec method ended
    })//Promise ended
}//function deactivateList ended
*/
//-----------------------------undoCreateItem------------------------------------------------------------
let undoCreateItem=(req, res)=>{    
    deactivateNotification(req, res)
        .then(deactivateItem)        
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Create Item undone successfully", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        }) 
          
}


//--------------------------------------------------------------------------------------------------------------
let undoDeleteItem=(req, res)=>{
    deactivateNotification(req, res)
        .then(activateItem)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Delete Item undone successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}

//------------------------------------------------------
//-----------------------------------------------------------------------------------------------
let undoEditItem=(req, res)=>{
    console.log("undoEditItem api function");
    deactivateNotification(req, res)
        .then(deactivateItem)
        .then(activateItem)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Item edit undone successfully", 200, resolve);                   
            res.send(apiResponse);
        })
        .catch((err)=>{ res.send(err);})
}
    //------------------------------Sub-Items related functions--------------------------------
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
    
    let createSubItem=(req, res)=>{
        console.log("------------createSubItem--------------");
        console.log(req.body);
        console.log("---------------------------------");
        create_sub_item(req)
        .then(create_Notification)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Notification creation successful", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
    }
    
    let create_sub_item=(req)=>{
        return new Promise((resolve, reject)=>{
            let randomId=shortId.generate();
            let newSubItem=new SubItemModel({
                subItemId:randomId,        
                subItemName:req.body.subItemName,
                itemId:req.body.itemId,
                createdOn:Date.now(),
                creatorId:req.body.creatorId,
                createdBy:req.body.createdBy,
                originId:randomId,
                refkey:randomId                  
            })
    
            newSubItem.save((err, subItem)=>{
                if(err){            
                    let apiResponse=response.generate(true, "SubItem creation - save action failed", 500, null);
                    reject(apiResponse);
                } else {
                    console.log(subItem);
                    let subItemObj=subItem.toObject();
                    delete subItemObj._id;
                    delete subItemObj.__v; 
                    
                    let obj={
                        type:"subItem",
                        action:"create",
                        typeId:subItemObj.subItemId,
                        itemId:subItemObj.itemId,
                        refkey:subItemObj.refkey,
                        message:"SubItem "+subItemObj.subItemName+"  created by "+subItemObj.createdBy,
                        creatorId:subItemObj.creatorId,
                        createdBy:subItemObj.createdBy
                    }
                    resolve(obj);
                }
            })
        })
    }
    
    let deleteSubItem=(req, res)=>{ 
        delete_sub_item(req, res)
            .then(create_Notification)
            .then((resolve)=>{
                let apiResponse=response.generate(false, "item deleted successfully", 200, resolve);
                res.send(apiResponse);
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    
    let delete_sub_item=(req, res)=>{
        console.log("*********************");
        console.log(req.body);
        console.log(req.body.changeBy);
        return new Promise((resolve, reject)=>{
           SubItemModel.findOne({'subItemId':req.body.subItemId})
                .exec((err, result)=>{
                    if(err){
                        let apiResponse=response.generate(true, "delete_item function::Some Error Occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        let apiResponse=response.generate(true, "delete_item function::No Data found", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.changeBy=req.body.changeBy;
                        result.changeOn=new Date();
                        result.personId=req.body.changeId;
                        
                        //console.log("deleted List" + JSON.stringify(result));
                        result.save((err, subItem)=>{
                            if(err){
                                let apiResponse=response.generate(true, "delete_item function::Save method::Some Error Occurred", 500, null);
                                reject(apiResponse);
                            } else { 
                                let subItemObj=subItem.toObject();
                                delete subItemObj._id;
                                delete subItemObj.__v; 
                                
                                let obj={
                                    type:"subItem",
                                    action:"delete",
                                    typeId:subItemObj.subItemId,
                                    listId:subItemObj.itemId,
                                    refkey:subItemObj.refkey,
                                    message:"Sub Item "+subItemObj.subItemName+"  deleted by "+subItemObj.changeBy,
                                    creatorId:subItemObj.personId,
                                    createdBy:subItemObj.changeBy
                                } 
                               
                                resolve(obj);
                            }
                        })  //save method ended              
                    }//else block ended
                })//exec method ended
            })//Promise ended
        }//delete_list ended  
    
    let deactivateSubItem=(req)=>{       
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':req.body.id})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "deactivateSubItem function:: error occured", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "deactivateSubItem function::No data found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=false;
                    result.save((err, item)=>{
                        if(err){
                            console.log("error in saving sub item");
                            let apiResponse=response.generate(true, "Some error occured", 500, null);
                            reject(apiResponse);
                        } else {
                            let itemObj=item.toObject();
                            delete itemObj._id;
                            delete itemObj.__v;
                            console.log("****************");
                            console.log(itemObj);
                            console.log("****************");
                            console.log(req.body);
                            console.log("************************");

                            if(req.action==="edit"){
                                itemObj.refId=req.body.refkey;
                                console.log("if - edit -itemObj.refId : "+itemObj.refId);
                            } else {
                                itemObj.refId=req.body.id;
                                console.log("else - other -itemObj.refId : "+itemObj.refId);
                            }                            
                            resolve(itemObj);
                        }
                    })
                }
            })
    
        })    
    }
    let activateSubItem=(obj)=>{
        console.log("refId in activateSubItem : " + obj.refId);
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':obj.refId})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "activateSubItem::Some Error Occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        console.log("No Data found");
                        let apiResponse=response.generate(true, "activateSubItem::No List Data Found", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=true;
                        result.save((err, newSubItem)=>{
                            if(err){
                                console.log(err);
                                let apiResponse=response.generate(true, "activateItem::Some Error Occurred", 500, null);
                                reject(apiResponse);
                            } else {
                                console.log("activateSubItem :: save method ");
                                console.log(newSubItem);
                                resolve(newSubItem);
                            }
                        })//save method ended
                    }//else block ended
                })//exec method ended
        })//Promise ended
    }//function activateItem ended
    //---------------------------------create list--------------------------------------------------
    //---------------------------------------------------------------------------------------------------------
    let editSubItem=(req, res)=>{
        
        saveOldSubItem(req, res)
            .then(createNewSubItem)
            .then(create_Notification)
            .then((resolve)=>{
                let apiResponse=response.generate(false, "Sub Item edited and notification sent successfully", 200, resolve);                   
                res.send(apiResponse);
            })
            .catch((err)=>{                               
                res.send(err);
            })
    }
    
    let saveOldSubItem=(req, res)=>{
        console.log("*************Save Old sub item****************");
        console.log(req.body.subItemId);
        return new Promise((resolve, reject)=>{
        SubItemModel.findOne({'subItemId':req.body.subItemId})
         .exec((err, oldSubItem)=>{
            if(err){
                console.log("saveOldSubItem  " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Some Error occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldSubItem)){
                console.log("saveOldItem::editItem " + "No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                reject(apiResponse);
            } else {
                console.log("oldSubItem saved");                
                oldSubItem.isActive=false;                                   
            
                oldSubItem.save((err, oldSubItemData)=>{
                    if(err){
                        console.log("oldSubItemData " + JSON.stringify(err));
                        let apiResponse=response.generate(true, "Save oldSubItemData action failed", 500, null);
                        reject(apiResponse);
                    } else {
                        console.log("old sub item saved : else block");
                        let obj={
                            oldSubItemData:oldSubItemData,
                            reqBody:req.body
                        }                         
                        resolve(obj);
                    }//else ended                        
                })//save method ended
            } //else of exec method ended
        })//exec method ended
    })//Promise ended
    }
    
    let createNewSubItem=(obj)=>{
        console.log("inside createNewSubItem function");
        return new Promise((resolve, reject)=>{
            let newSubItem=new SubItemModel({ 
                subItemId:shortId.generate(),               
                subItemName:obj.reqBody.subItemName,
                itemId:obj.reqBody.itemId,
                createdOn:obj.oldSubItemData.createdOn,
                creatorId:obj.oldSubItemData.creatorId,
                createdBy:obj.oldSubItemData.createdBy,
                changeOn:Date.now(),                
                changeBy:obj.reqBody.changeName,
                personId:obj.reqBody.changeId,
                originId:obj.oldSubItemData.originId,
                refkey:obj.oldSubItemData.subItemId
            })       
    
            newSubItem.save((err, savedSubItem)=>{
                if(err){
                    console.log("createNewItem::editItem function " + err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                   
                    reject(apiResponse);
                } else {
                    console.log("createNewItem::editItem function :saveItem " + savedSubItem);
                    let editedSubItem=savedSubItem.toObject();
                    delete editedSubItem._id;
                    delete editedSubItem.__v;
                    let newObj={
                        type:"subItem",
                        action:"edit",
                        typeId:editedSubItem.subItemId,
                        name:editedSubItem.subItemName,
                        itemId:editedSubItem.itemId,
                        refkey:editedSubItem.refkey,
                        message:"Sub Item "+editedSubItem.subItemName+"  edited by "+obj.reqBody.changeName,
                        creatorId:obj.reqBody.changeId,
                        createdBy:obj.reqBody.changeName
                    }                                
                    resolve(newObj);
                }
            })
        })
    }
    
    //----------------------------------------------------------------------------------------------------------
    let changeSubItemStatus=(req, res)=>{
        change_sub_item_status(req, res)
            .then(create_Notification)
            .then((resolve)=>{
                let apiResponse=response.generate(false, "Sub Item Status Changed Successfully", 200, resolve);
                res.send(apiResponse);
            })
            .catch((err)=>{
                res.send(err);
            })
        
    }
    let change_sub_item_status=(req, res)=>{
        console.log("^^^^^^^^^^^^^^^^^^^");
        console.log(req.body.subItemId);
        return new Promise((resolve, reject)=>{
        SubItemModel.findOne({'subItemId':req.body.subItemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Some error occured", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                reject(apiResponse);
            } else {
                if(result.status==="open"){
                    result.status="done"
                } else if(result.status==="done") {
                    result.status="open"
                }
                result.changeOn=Date.now();
                result.changeBy=req.body.changeName;
                result.personId=req.body.userId;
    
                result.save((err, subItem)=>{
                    if(err){
                        //console.log(err);
                    } else {
                        console.log("444444444444444");
                        console.log(subItem);
                        let subItemObj=subItem.toObject();
                        delete subItemObj._id;
                        delete subItemObj.__v;
                        
                        let obj={
                            type:"subItem",
                            action:"status-change",
                            typeId:subItemObj.subItemId,
                            itemId:subItemObj.itemId,
                            refkey:subItemObj.refkey,
                            message:"Sub  Item "+subItemObj.subItemName+"  status changed by "+subItemObj.createdBy,
                            creatorId:subItemObj.creatorId,
                            createdBy:subItemObj.createdBy
                        }                        
                        resolve(obj);
                    }
                })
            }
        })
    
        })
    }
    //----------------------------------------------------------------------------------------
    
    //-----------------------------undoCreateItem------------------------------------------------------------
    let undoCreateSubItem=(req, res)=>{    
        deactivateNotification(req, res)
            .then(deactivateSubItem)        
            .then((resolve)=>{            
                let apiResponse=response.generate(false, "Create Item undone successfully", 200, resolve);
                console.log(apiResponse);
                res.send(apiResponse);
            })
            .catch((err)=>{
                res.send(err);
            })              
    }   
    //--------------------------------------------------------------------------------------------------------------
    let undoDeleteSubItem=(req, res)=>{
        deactivateNotification(req, res)
            .then(activateSubItem)
            .then((resolve)=>{
                let apiResponse=response.generate(false, "Delete Item undone successfully", 200, resolve);
                res.send(apiResponse);
            })
            .catch((err)=>{
                res.send(err);
            })    
    }
    
    //------------------------------------------------------
    //-----------------------------------------------------------------------------------------------
    let undoEditSubItem=(req, res)=>{
        console.log("undoEditSubItem api function");
        deactivateNotification(req, res)
            .then(deactivateSubItem)
            .then(activateSubItem)        
            .then((resolve)=>{
                let apiResponse=response.generate(false, "Sub Item edit undone successfully", 200, resolve);                   
                res.send(apiResponse);
            })
            .catch((err)=>{ res.send(err);})
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


//----------------------------------------------------------------------------------------------