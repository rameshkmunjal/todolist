//including packages
const mongoose=require('mongoose');
const shortId=require('shortid');
//including files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');

//including model
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
let getNotificationList=(req, res)=>{
    NotificationModel.find({'isActive':true})
        .exec((err, notifications)=>{
            if(err){
                console.log("getNotificationList:Some Error Occurred");
            } else if(check.isEmpty(notifications)){
                console.log("getNotificationList:No Data found");
            } else {
                let apiResponse=response.generate(false, "Notifications fetched successfully", 200, notifications);
                res.send(apiResponse);
            }
        })
}
//---------------------------------------------------------------------------------------------------
let changeStatusList=(req, res)=>{
    ListModel.findOne({'listId':req.body.listId})
        .exec((err, result)=>{
            if(err){
                console.log(err);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
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
                        console.log(err);
                    } else {
                        let listObj=list.toObject();
                        delete listObj._id;
                        delete listObj.__v;
                        listObj.action=req.body.action;
                        listObj.type=req.body.type;
                        let apiResponse=response.generate(false, "List Status Changed Successfully", 200, listObj);
                        res.send(apiResponse);
                    }
                })
            }
        })
}
//-----------------------------undoCreateList------------------------------------------------------------
let undoCreateList=(req, res)=>{    
    deactivateNotification(req, res)
        .then(deactivateList)
        //.then(getAllLists)
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


//--------------------------deactivate notification----------------------------------------------
let deactivateNotification=(req, res)=>{
    
    return new Promise((resolve, reject)=>{   
        console.log(req.body.notificationId);
        NotificationModel.findOne({'id': req.body.notificationId})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                    //res.send(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "No Notif Data found", 404, null);
                    reject(apiResponse);
                    //res.send(apiResponse);
                } else {
                    result.isActive=false;
                    result.save((err, editedNotif)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                            //res.send(apiResponse);
                        } else{                                
                            resolve(req);
                            //let apiResponse=response.generate(false, "Sucess", 200, editedNotif);                                
                            //res.send(apiResponse);
                        }
                    })
                }
            })
    })

}
//-----------------------------------deactivate list-------------------------------------------
let deactivateList=(req)=>{
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&& Deactivate List ");
    console.log(req.body.id);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&& Deactivate List ");
    return new Promise(function(resolve, reject){
        //console.log("************************** List id is : "+ JSON.stringify(notif.id));
        ListModel.findOne({'listId':req.body.id})
            .exec((err, result)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(result)){
                    console.log("No Data found");
                    let apiResponse=response.generate(true, "No Data Found", 404, null);
                    reject(apiResponse);
                } else {
                    result.isActive=false;
                    result.save((err, newList)=>{
                        if(err){
                            console.log(err);
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else {
                            console.log("*****************************");
                            console.log(newList);
                            console.log("*****************************");
                        
                            resolve(newList);
                        }
                    })//save method ended
                }//else block ended
            })//exec method ended
    });//Promise ended    
}//function deactivateList ended
//---------------------------------------activate list----------------------------------------------
let activateList=(req)=>{
    return new Promise((resolve, reject)=>{
        ListModel.findOne({'listId':req.body.id})
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
                listObj.type="list";
                listObj.action="create";
                req.list=listObj ;
                req.body.type="list";
                req.body.action="create";
                req.body.message= "List " + req.body.listName +" created by "+req.body.createdBy;             
                resolve(req.body);
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
                    
                    console.log("deleted List" + JSON.stringify(result));
                    result.save((err, list)=>{
                        if(err){
                            let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                            reject(apiResponse);
                        } else { 
                            let listObj=list.toObject();
                            delete listObj._id;
                            delete listObj.__v; 
                            listObj.action="delete";
                            listObj.type="list"; 
                            req.body.message= "List " + req.body.listName +" deleted by "+req.body.changeBy;             
                            resolve(req.body);
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
    return new Promise((resolve, reject)=>{
    ListModel.findOne({'listId':req.body.listId, 'isActive':true})
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
            oldList.isActive=false;                                   
        
            oldList.save((err, oldListData)=>{
                if(err){
                    //console.log("FunctionsLib::editList " + JSON.stringify(err));
                    let apiResponse=response.generate(true, "Save old list action failed", 500, null);
                    reject(apiResponse);
                } else {
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
                let obj={
                    type:"list",
                    action:"edit",
                    typeId:editedList.listId,
                    message:"List "+editedList.listName+"  edited by "+editedList.createdBy,
                    creatorId:editedList.creatorId,
                    createdBy:editedList.createdBy
                }                
                resolve(obj);
            }
        })
    })        
}
//------------------------------------------------------------------------------------------------------------------

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                
//------------------------------------------------------
module.exports={
    createList:createList,
    deleteList:deleteList, 
    editList:editList,
    changeStatusList:changeStatusList,
    undoCreateList:undoCreateList, 
    undoDeleteList:undoDeleteList,  
    getAllListsByUserId:getAllListsByUserId,
    //createNotification:createNotification,
    getNotificationList:getNotificationList    
}


//----------------------------------------------------------------------------------------------