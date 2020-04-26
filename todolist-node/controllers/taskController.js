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
                            //console.log(editedNotif); 
                            let obj=editedNotif.toObject(); 
                            
                            if(obj.action="create"){
                              req.refId=obj.typeId;
                            }else if(obj.action="delete"){
                               req.refId=obj.refkey;
                            } else if(obj.action="edit"){
                               req.refId=obj.typeId;
                            }
                            console.log("refId : "+req.refId);                                                      
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
let getOldList=(obj)=>{
    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX");
    //console.log(obj.oldListData);
    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX");
    return new Promise((resolve, reject)=>{
        ListModel.findOne({'listId':obj.oldListData.refKey})
         .exec((err, oldList)=>{
            if(err){
                //console.log("FunctionsLib::editList  " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldList)){
                //console.log("FunctionsLib::editList " + "No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                reject(apiResponse);
            } else {                
                oldList.isActive=true;                                   
            
                oldList.save((err, oldListData)=>{
                    if(err){
                        //("FunctionsLib::editList " + JSON.stringify(err));
                        let apiResponse=response.generate(true, "Save old list action failed", 500, null);
                        reject(apiResponse);
                    } else { 
                        //console.log("getOldList - save - else block ");                                               
                        resolve(oldListData);
                    }//else ended                        
                })//save method ended
            } //else of exec method ended
        })//exec method ended
    })//Promise ended
}                
//------------------------------------------------------
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
    getLatestNotification:getLatestNotification    
}


//----------------------------------------------------------------------------------------------