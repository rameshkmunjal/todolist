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
                        console.log("sub item changed and saved ");
                        console.log(savedRecord);
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let undoNotfication=(subItemRecord)=>{
        console.log(subItemRecord);
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
    
    undoSubItem(data, undoCreateSubItemCB)
        .then(undoNotfication)        
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
    let undoSubItem=()=>{
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
                        console.log(savedRecord);
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let undoNotfication=(subItemRecord)=>{
        console.log(subItemRecord);
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
    
    undoSubItem(data, undoChangeSubItemCB)
        .then(undoNotfication)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoChangeSubItemCB(apiResponse);
        })
        .catch((err)=>{
            undoChangeSubItemCB(err);
        })
}//function ended
//------------------------------------exporting functions------------------------------------------------------
module.exports={ 
    undoCreateSubItem:undoCreateSubItem,    
    undoDeleteSubItem:undoDeleteSubItem
}