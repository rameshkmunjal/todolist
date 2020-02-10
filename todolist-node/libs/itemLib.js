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

let undoCreateItem=(data, undoCreateItemCB)=>{
    console.log("inside undoCreateItemCB");
    let undoNotification=(data)=>{
        //console.log(itemRecord);
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateItemCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoCreateItemCB : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoCreateItemCB", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    let undoItem=(saveNotif)=>{
        console.log(saveNotif);
        return new Promise((resolve, reject)=>{
            ItemModel.findOne({'itemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoCreateItemCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoCreateItemCB : undoList", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateItemCB", 500, null);
                        reject(apiResponse);
                    } else {
                        let obj=savedRecord.toObject();
                        delete obj._id;
                        delete obj.__v;
                        obj.type="item";
                        resolve(obj);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    
    
    undoNotification(data, undoCreateItemCB)
        .then(undoItem)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoCreateItemCB(apiResponse);
        })
        .catch((err)=>{
            undoCreateItemCB(err);
        })
}//function ended
//---------------------------------------------------------------------------------------------
let undoDeleteItem=(data, undoChangeItemCB)=>{
    let undoNotification=()=>{
        //console.log(itemRecord);
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeItem", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoChangeItem : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoChangeItem", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    let undoItem=(saveNotif)=>{
        console.log(saveNotif);
        return new Promise((resolve, reject)=>{
            ItemModel.findOne({'itemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoChangeItem", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoChangeItem : undoItem", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=true;   
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeItem", 500, null);
                        reject(apiResponse);
                    } else {
                        let obj=savedRecord.toObject();
                        delete obj._id;
                        delete obj.__v; 
                        obj.type="item";                      
                        resolve(obj);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    
    
    undoNotification(data, undoChangeItemCB)
        .then(undoItem)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoChangeItemCB(apiResponse);
        })
        .catch((err)=>{
            undoChangeItemCB(err);
        })
}//function ended
//---------------------------------------------------------------------------------------------

let undoEditItem=(data, undoEditItemCB)=>{
    console.log("inside undoEditItem");
    let undoNotification=()=>{
        
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoEditItemCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoEditItemCB : undoNotification", 404, null);
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
    let undoItem=()=>{        
        return new Promise((resolve, reject)=>{
            ItemModel.findOne({'itemId':data.typeId})
            .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoItemListCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoEditItemCB : undoItem", 404, null);
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

    let tracePreviousItem=(savedRecord)=>{
        console.log(savedRecord);
        return new Promise((resolve, reject)=>{
            ItemModel.findOne({'itemId':savedRecord.refkey})
                .exec((err, result)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Undo failed : undoEditItemCB : tracePreviousItem", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        let apiResponse=response.generate(true, "No Data found : undoEditItemCB : tracePreviousItem", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=true;
                        result.save((err, newRecord)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoEditItemCB : tracePreviousItem", 500, null);
                                reject(apiResponse);
                            } else {                                
                                let obj=newRecord.toObject();
                                delete obj._id;
                                delete obj.__v; 
                                obj.type="item"; 
                                console.log("newRecorrd : "+JSON.stringify(obj));                     
                                resolve(obj);
                            }
                        })
                    }
                })
        })
    }

    
    
    undoNotification(data, undoEditItemCB)
        .then(undoItem)
        .then(tracePreviousItem)                
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            apiResponse.type="item";
            undoEditItemCB(apiResponse);
        })
        .catch((err)=>{
            undoEditItemCB(err);
        })
}//function ended

//------------------------------------exporting functions------------------------------------------------------
//------------------------------------exporting functions------------------------------------------------------
module.exports={
    undoCreateItem:undoCreateItem, 
    undoDeleteItem:undoDeleteItem,
    undoEditItem:undoEditItem
    //undoChangeSubItem:undoChangeSubItem
}