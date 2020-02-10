//including packages
const mongoose=require('mongoose');
const shortId=require('shortid');
//including files
const response=require('./responseLib');
const check=require('./checkLib');

//including models-files 
require('../models/user');
const UserModel=mongoose.model('User');
require('../models/list');
const ListModel=mongoose.model('List');
require('../models/listitem');
const ItemModel=mongoose.model('listitem');
require('../models/subitem');
const SubItemModel=mongoose.model('subItem');
require('../models/notification');
const NotificationModel=mongoose.model('notification');
//NotificationModel
//---------------------------------------------------------------------------------------------

let undoCreateSubItem=(data, undoCreateSubItemCB)=>{
    console.log("inside undoCreateSubItemCB");
    let undoNotification=()=>{
        
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateSubItemCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoCreateSubItemCB : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoCreateSubItemCB", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    let undoSubItem=()=>{
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoCreateSubItemCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoCreateSubItemCB : undoSubItem", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateSubItemCB", 500, null);
                        reject(apiResponse);
                    } else {
                        let obj=savedRecord.toObject();
                        delete obj._id;
                        delete obj.__v; 
                        obj.type="subItem";                      
                        resolve(obj);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended
    
    undoNotification(data, undoCreateSubItemCB)
        .then(undoSubItem)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoCreateSubItemCB(apiResponse);
        })
        .catch((err)=>{
            undoCreateSubItemCB(err);
        })
}//function ended
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
let undoDeleteSubItem=(data, undoChangeSubItemCB)=>{
    console.log("inside undoChangeSubItem function ");
    let undoNotification=()=>{
        
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeSubItem", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoChangeSubItem : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;

                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoChangeSubItem", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    let undoSubItem=(saveNotif)=>{
        console.log(saveNotif);
        return new Promise((resolve, reject)=>{
        SubItemModel.findOne({'subItemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoChangeSubItem", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoChangeSubItem : undoItem", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=true;    
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeSubItem", 500, null);
                        reject(apiResponse);
                    } else {
                        let obj=savedRecord.toObject();
                        delete obj._id;
                        delete obj.__v; 
                        obj.type="subItem";                      
                        resolve(obj);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    
    
    undoNotification(data, undoChangeSubItemCB)
        .then(undoSubItem)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoChangeSubItemCB(apiResponse);
        })
        .catch((err)=>{
            undoChangeSubItemCB(err);
        })
}//function ended
//------------------------------------------------------------------------------------------------------------
let undoEditSubItem=(data, undoEditSubItemCB)=>{
    console.log("inside undoSubEditItem");
    let undoNotification=()=>{        
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoEditSubItemCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoEditSubItemCB : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoEditItemCB", 500, null);
                                reject(apiResponse);
                            } else {
                                console.log(saveNotif);                                
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    let undoSubItem=()=>{        
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoSubItemListCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoSubEditItemCB : undoSubItem", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, savedRecord)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoItemListCB", 500, null);
                        reject(apiResponse);
                    } else {                        
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let tracePreviousSubItem=(savedRecord)=>{
        console.log(savedRecord);
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':savedRecord.refkey})
                .exec((err, result)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Undo failed : undoEditSubItemCB : tracePreviousSubItem", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        let apiResponse=response.generate(true, "No Data found : undoEditSubItemCB : tracePreviousSubItem", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=true;
                        result.save((err, newRecord)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoEditSubItemCB : tracePreviousSubItem", 500, null);
                                reject(apiResponse);
                            } else {                                
                                let obj=newRecord.toObject();
                                delete obj._id;
                                delete obj.__v; 
                                obj.type="subItem"; 
                                //console.log("newRecorrd : "+JSON.stringify(obj));                     
                                resolve(obj);
                            }
                        })
                    }
                })
        })
    }

    
    
    undoNotification(data, undoEditSubItemCB)
        .then(undoSubItem)
        .then(tracePreviousSubItem)                
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            apiResponse.type="item";
            undoEditSubItemCB(apiResponse);
        })
        .catch((err)=>{
            undoEditSubItemCB(err);
        })
}//function ended

//------------------------------------exporting functions------------------------------------------------------
//------------------------------------exporting functions------------------------------------------------------
module.exports={ 
    undoCreateSubItem:undoCreateSubItem,    
    undoDeleteSubItem:undoDeleteSubItem, 
    undoEditSubItem:undoEditSubItem
}