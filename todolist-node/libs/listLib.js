//including packages
const mongoose=require('mongoose');
const shortId=require('shortid');
//including files
const response=require('./responseLib');
const check=require('./checkLib');

//including models-files 
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
//NotificationModel
//---------------------------------------------------------------------------------------------

let undoCreateList=(data, undoCreateListCB)=>{
    console.log("inside undoCreateListCB");
    let undoList=()=>{
        return new Promise((resolve, reject)=>{
            ListModel.findOne({'listId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoCreateListCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoCreateListCB : undoList", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateListCB", 500, null);
                        reject(apiResponse);
                    } else {
                        console.log("list changed and saved ");
                        console.log(savedRecord);
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let undoNotfication=(listRecord)=>{
        console.log(listRecord);
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoCreateListCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoCreateListCB : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoCreateListCB", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    
    undoList(data, undoCreateListCB)
        .then(undoNotfication)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoCreateListCB(apiResponse);
        })
        .catch((err)=>{
            undoCreateListCB(err);
        })
}//function ended
//---------------------------------------------------------------------------------------------

let undoDeleteList=(data, undoChangeListCB)=>{
    console.log("inside undoChangeList");
    let undoList=()=>{
        return new Promise((resolve, reject)=>{
            ListModel.findOne({'listId':data.typeId})
            .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoChangeList", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoChangeList : undoList", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=true;
                result.save((err, savedRecord)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeList", 500, null);
                        reject(apiResponse);
                    } else {
                        console.log("list changed and saved ");
                        console.log(savedRecord);
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let undoNotfication=(listRecord)=>{
        console.log(listRecord);
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoChangeList", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoChangeList : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoChangeList", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(saveNotif);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    
    undoList(data, undoChangeListCB)
        .then(undoNotfication)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            undoChangeListCB(apiResponse);
        })
        .catch((err)=>{
            undoChangeListCB(err);
        })
}//function ended

//------------------------------------exporting functions------------------------------------------------------
//---------------------------------------------------------------------------------------------
let undoEditList=(data, undoEditListCB)=>{
    console.log("inside undoChangeList");
    let undoList=()=>{
        return new Promise((resolve, reject)=>{
            ListModel.findOne({'listId':data.typeId})
            .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Undo failed : undoEditListCB", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found : undoEditListCB : undoList", 404, null);
                reject(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, savedRecord)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoEditListCB", 500, null);
                        reject(apiResponse);
                    } else {
                        //console.log("list changed and saved ");
                        //console.log(savedRecord);
                        resolve(savedRecord);
                    }//else ended
                })//save ended
             }//else ended
         })//exec ended
      })//Promise ended
    }//undoList function ended

    let tracePreviousList=(savedRecord)=>{
        return new Promise((resolve, reject)=>{
            ListModel.findOne({'listId':savedRecord.refkey})
                .exec((err, result)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Undo failed : undoEditListCB : tracePreviousList", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        let apiResponse=response.generate(true, "No Data found : undoEditListCB : tracePreviousList", 500, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=true;
                        result.save((err, newRecord)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoEditListCB : tracePreviousList", 500, null);
                                reject(apiResponse);
                            } else {
                                resolve(newRecord);
                            }
                        })
                    }
                })
        })
    }

    let undoNotfication=(listRecord)=>{
        console.log(listRecord);
        return new Promise((resolve, reject)=>{
            NotificationModel.findOne({id:data.id})
                .exec((err, result)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Undo failed : undoEditListCB", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(result)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data found : undoEditListCB : undoNotification", 404, null);
                        reject(apiResponse);
                    } else {
                        result.isActive=false;
                        result.save((err, saveNotif)=>{
                            if(err){
                                let apiResponse=response.generate(true, "Undo failed : undoEditListCB", 500, null);
                                reject(apiResponse);
                            } else {
                                console.log(saveNotif);                                
                                resolve(listRecord);                                
                            }//else ended
                        })//save ended
                    }//else ended
                })//exec ended
        })//Promise ended
    }//function ended
    
    undoList(data, undoEditListCB)
        .then(tracePreviousList)
        .then(undoNotfication)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "undo successful", 200, resolve);
            apiResponse.type="list";
            undoEditListCB(apiResponse);
        })
        .catch((err)=>{
            undoEditListCB(err);
        })
}//function ended

//------------------------------------exporting functions------------------------------------------------------
module.exports={    
    undoCreateList:undoCreateList,
    undoEditList:undoEditList,
    undoDeleteList:undoDeleteList
    
}