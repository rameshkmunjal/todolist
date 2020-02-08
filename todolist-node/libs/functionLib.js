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
//function - to get all lists 
let getAllLists=(data, allListsCB)=>{
    //console.log(data.userId);
    ListModel.find({'creatorId':data.userId, 'isActive':true})
        .exec((err, allLists)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                allListsCB(apiResponse);
            } else if(check.isEmpty(allLists)){                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allListsCB(apiResponse);
            } else {
                //console.log("Matching data found");
                let apiResponse=response.generate(false, "All Lists Data fetched successfully", 200, allLists);
                apiResponse.socketLoginId=data.userId;
                //console.log(apiResponse);
                allListsCB(apiResponse);
            }
        })
}
//---------------------------------------------------------------------------------------------
//function - to create list 
let createList=(data, listData)=>{
    let randomId=shortId.generate();
    let newList=new ListModel({
        listId:randomId,        
        listName:data.listName,
        createdOn:Date.now(),
        creatorId:data.creatorId,
        createdBy:data.createdBy,
        originId:randomId,
        refkey:randomId                  
    })
//saving in DB
console.log(newList);
    newList.save((err, list)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "List creation - save action failed", 500, null);
            listData(apiResponse);
        } else {
            let listObj=list.toObject();
            delete listObj._id;
            delete listObj.__v; 
            listObj.type="list";
            listObj.action="create";
            let apiResponse=response.generate(false, "List created successfully", 200, listObj);
            console.log(apiResponse);
            listData(apiResponse);
        }
    })
}
//--------------------------------------------------------------------------------------------------------
//function - to edit list
let editList=(data, editListCB)=>{
    //console.log(data);
    let saveOldList=()=>{
        return new Promise((resolve, reject)=>{
        ListModel.findOne({'originId':data.listId, 'isActive':true})
         .exec((err, oldList)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldList)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                reject(apiResponse);
            } else {                
                oldList.isActive=false;                                   
            
                oldList.save((err, oldListData)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Save old list action failed", 500, null);
                        reject(apiResponse);
                    } else {                         
                        resolve(oldListData);
                    }//else ended                        
                })//save method ended
            } //else of exec method ended
        })//exec method ended
    })//Promise ended
}
    
    let createNewList=(oldListData)=>{
        return new Promise((resolve, reject)=>{
            let newList=new ListModel({ 
                listId:shortId.generate(),               
                listName:data.listName,
                createdOn:oldListData.createdOn,
                creatorId:oldListData.creatorId,
                createdBy:oldListData.createdBy,
                changeOn:Date.now(),                
                changeBy:data.changeName,
                personId:data.userId,
                originId:oldListData.originId,
                refkey:oldListData.listId
            })

            newList.save((err, savedList)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                   
                    reject(apiResponse);
                } else {
                    let editedList=savedList.toObject();
                    delete editedList._id;
                    delete editedList.__v;
                    editedList.action=data.action;
                    editedList.type=data.type;
                    //console.log("**************************");
                    //console.log(editedList);
                    resolve(editedList);
                }
            })
        })        
    }
    
    saveOldList(data, editListCB)
        .then(createNewList)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "List edited successfully", 200, resolve);                   
            editListCB(apiResponse);
        })
        .catch((err)=>{                               
            editListCB(err);
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to delete list 
let deleteList=(data, listData)=>{    
    ListModel.findOne({'originId':data.listId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Delete action failed : some error", 500, null);
                listData(apiResponse);
            } else if(check.isEmpty(result)){
                // console.log("No  data found");
                let apiResponse=response.generate(true, "No  data found", 404, null);
                listData(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, deletedList)=>{
                    if(err){
                        console.log(err);
                    } else {
                        console.log(deletedList);
                        let list=deletedList.toObject();
                        list.type="list";
                        delete list._id;
                        delete list.__v; 
                        list.action="delete";                       
                        let apiResponse=response.generate(false, "List Deleted Successfully", 200, list);
                        listData(apiResponse);
                    }
                })
                
            }
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to create item
let createItem=(data, itemCB)=>{
    let randomId=shortId.generate(); 
    console.log(randomId);

    let newItem=new ItemModel({
        itemId:randomId,
        itemName:data.itemName,        
        createdOn:Date.now(),
        createdBy:data.createdBy,
        creatorId:data.creatorId,
        listId:data.listId, 
        originId:randomId        
    });
    console.log(newItem);
    //save - item created in DB
    newItem.save((err, newItem)=>{
        if(err){
            console.log(err);
            let apiResponse=response.generate(true, "Create Item : Save action failed", 500, null);
            itemCB(apiResponse);
        } else {
            let item=newItem.toObject();
            delete item._id;
            delete item.__v;
            delete item.changeOn;
            delete item.changeBy;
            item.type="item";
            item.action="create";
            
            let apiResponse=response.generate(false, "Data created successfully", 200, item);
            itemCB(apiResponse);            
        }
    })            
}
//------------------------------------------------------------------------------------------------------
//function - to edit item
let editItem=(data, editItemCB)=>{
    let saveOldItem=()=>{
        return new Promise((resolve, reject)=>{
          ItemModel.findOne({'originId':data.itemId, 'isActive':true})
            .exec((err, oldItem)=>{
            if(err){                
                let apiResponse=response.generate(true, "Edit action failed", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldItem)){                
                let apiResponse=response.generate(true, "No data found", 404, null);
                reject(apiResponse);
            } else {
                oldItem.isActive=false;
                oldItem.save((err, oldItemData)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Save in Edit action failed", 500, null);
                        reject(apiResponse);
                    } else {
                        resolve(oldItemData);
                    }
                })//save ended
              }//else ended
          })//exec ended
    })//Promise ended
} //saveOldItem ended  

    let createNewItem=(oldItemData)=>{
        return new  Promise((resolve, reject)=>{
            let newItem=new ItemModel({
                itemId:shortId.generate(),                
                itemName:data.itemName,
                listId:data.listId,
                createdOn:oldItemData.createdOn,
                createdBy:oldItemData.createdBy,
                creatorId:oldItemData.creatorId,
                changeOn:Date.now(),                
                changeBy:data.changeName,
                personId:data.userId,
                originId:oldItemData.originId
            })//new method ended

            newItem.save((err, item)=>{
                if(err){
                    console.log(err);
                    let apiResponse=response.generate(true, "Edit action failed", 500, null);
                    reject(apiResponse);
                } else {
                    let obj=item.toObject();
                    delete obj.__v;
                    delete obj._id;
                    obj.type="item";
                    obj.action="edit";                   
                    resolve(obj);
                }
            })
        })
    }

    saveOldItem(data, editItemCB)
        .then(createNewItem)
        .then((resolve)=>{             
            let apiResponse=response.generate(false, "Item edited successfully", 200, resolve);
            //console.log(apiResponse);                   
            editItemCB(apiResponse);
        })
        .catch((err)=>{                               
            editItemCB(err);
        })
            
                      
}
//----------------------------------------------------------------------------------------------------------
//function - to delete item
let deleteItem=(data, itemData)=>{
    ItemModel.findOne({'originId':data.itemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                itemData(apiResponse);                
            } else if(check.isEmpty(result)){
                //console.log("No  data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                itemData(apiResponse);
            } else {
                result.isActive=false;
                
                result.save((err, deletedItem)=>{
                    if(err){
                        console.log(err);
                    } else {
                        let delItem=deletedItem.toObject();
                        delete delItem.__v;
                        delete delItem._id;
                        delItem.type="item";
                        delItem.action="delete";
                        let apiResponse=response.generate(false, "Item Deleted successfully", 200, delItem);
                        itemData(apiResponse);
                    }                    
                })                               
            }
        })
}
//-------------------------------------------------------------------------------------------------------
//function - to get items using list id
let getItemsByListId=(data, allItemsCB)=>{
    //console.log("data in getItemByListId : "+ JSON.stringify(data));    
    ItemModel.find({'listId':data.listId, 'isActive':true})
        .exec((err, allItems)=>{
            if(err){                
                let apiResponse=response.generate(true, "Items fetching by listId failed", 500, null);
                allItemsCB(apiResponse)
            } else if(check.isEmpty(allItems)){
                //console.log("no data found - due to origin id");                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allItemsCB(apiResponse);
            } else {
                //console.log("no data found - no problem of  origin id");
                let apiResponse=response.generate(false, "All items of list fetched successfully", 200, allItems)
                apiResponse.socketLoginId=data.userId;
                apiResponse.listName=data.listName;
                allItemsCB(apiResponse);
            }
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to create sub item
let createSubItem=(data, subItemCB)=>{ 
     let randomId=shortId.generate();  
    let newSubItem=new SubItemModel({
        subItemId:randomId,
        subItemName:data.subItemName,    
        createdOn:Date.now(),
        createdBy:data.createdBy,
        creatorId:data.creatorId,        
        itemId:data.itemId,
        originId:randomId       
    });
    // to save created sub item in DB
    newSubItem.save((err, updatedList)=>{
        if(err){ 
            console.log(err);           
            let apiResponse=response.generate(true, "Save action failed after sub item creation", 500, null);
            subItemCB(apiResponse);
        } else {
            let newSubItem=updatedList.toObject();
            delete newSubItem._id;
            delete newSubItem._v;
            delete newSubItem._id;
            delete newSubItem.changeOn;            
            delete newSubItem.changeBy;
            newSubItem.type="subItem";
            newSubItem.action="create";

            let apiResponse=response.generate(false, "Sub Item created successfully", 200, newSubItem);
            subItemCB(apiResponse);
        }
    })            
}
//-------------------------------------------------------------------------------------------------------------
//function - to edit item 
let editSubItem=(data, editSubItemCB)=>{
    //console.log(data);
    let saveOldSubItem=()=>{
        return new Promise((resolve, reject)=>{
            SubItemModel.findOne({'subItemId':data.subItemId, 'isActive':true})
             .exec((err, oldSubItem)=>{
            if(err){                
                let apiResponse=response.generate(true, "Edit action failed : Some Error", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldSubItem)){                
                let apiResponse=response.generate(true, "EditSubItem : No Data found", 404, null);
                reject(apiResponse)
            } else {  
                oldSubItem.isActive=false;                                  
            
                oldSubItem.save((err, subItemData)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Save action failed : Sub Item edition", 500, null);                   
                        reject(apiResponse);
                    } else { 
                        resolve(subItemData);
                    }
                })//save method ended
            }//else ended
        })//exec
    })//Promise ended
}   
    let createNewSubItem=(subItemData)=>{
        return new Promise((resolve, reject)=>{            
                let newSubItem= new SubItemModel({
                    subItemId:shortId.generate(),                    
                    subItemName:data.subItemName,
                    itemId:data.itemId,
                    createdOn:subItemData.createdOn,
                    creatorId:subItemData.creatorId,
                    createdBy:subItemData.createdBy,
                    changeOn:Date.now(),                    
                    changeBy:data.changeName,
                    personId:subItemData.userId,
                    originId:subItemData.originId
                })

                newSubItem.save((err, editedSubItem)=>{
                    if(err){
                        console.log(err);
                        let apiResponse=response.generate(true, "Create sub item action failed", 500, null);
                        reject(apiResponse);
                    } else {
                        let editedData=editedSubItem.toObject();
                        delete editedData.__v;
                        delete editedData._id;
                        editedData.action="edit";
                        editedData.type="subItem";
                        resolve(editedData);
                    }//else ended
                })//save method ended                   
        })//Promise ended
    }//createNewSubItem ended

    saveOldSubItem(data, editSubItemCB)
        .then(createNewSubItem)
        .then((resolve)=>{
            console.log(resolve);
            let apiResponse=response.generate(false, "sub item edited successfully", 200, resolve);
            editSubItemCB(apiResponse);
        })
        .catch((err)=>{
            
            editSubItemCB(err);
        })
}
//---------------------------------------------------------------------------------------------------------------
//function - to delete sub item 
let deleteSubItem=(data, subItemData)=>{    
    SubItemModel.findOne({'originId':data.subItemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Deletion failed : Some Error", 500, null);
                subItemData(apiResponse);                
            } else if(check.isEmpty(result)){
                //console.log("No  data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                subItemData(apiResponse);
            } else {
                //console.log(result);
                result.isActive=false;
                
                result.save((err, delData)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Deletion failed : Some Error", 500, null);
                        subItemData(apiResponse);
                    } else{
                        let delSubItem=delData.toObject();
                        delete delSubItem.__v;
                        delete delSubItem._id;
                        delSubItem.type="subItem";
                        delSubItem.action="delete";
                        let apiResponse=response.generate(false, "Sub Item deleted successfully", 200, delSubItem);
                        subItemData(apiResponse);
                    }
                })
                
            }   
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to get sub items using item id
let getSubItemsByItemId=(data, allSubItemsCB)=>{
    //console.log("in getSubItemsByItemId function");
    console.log(data);
    SubItemModel.find({'itemId':data.itemId, 'isActive':true})
        .exec((err, allSubItems)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                allSubItemsCB(apiResponse);
            } else if(check.isEmpty(allSubItems)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allSubItemsCB(apiResponse);
            } else {
                let apiResponse=response.generate(false, "All items of list fetched successfully", 200, allSubItems)
                apiResponse.socketLoginId=data.userId;
                allSubItemsCB(apiResponse);
            }
    })
}
//--------------------------------------------------------------------------------------------------------------------
//function - to accept friend request
let acceptFriendRequest=(data, friendCB)=>{
    //append friend request sender data in receiver/acceptor user data
    let appendFriendData=()=>{        
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':data.receiverId})
                .exec((err, friendDetails)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                
                        reject(apiResponse);
                    } else if(check.isEmpty(friendDetails)){
                        //console.log("No Data found");
                        let apiResponse=response.generate(true, "No Data Found", 404, null);                
                        reject(apiResponse);
                    } else {
                        let receiverName=friendDetails.firstName+" "+friendDetails.lastName;
                        let temp={
                            friendId:data.senderId,
                            friendName:data.senderName
                        }
                        friendDetails.friends.push(temp);

                        friendDetails.save((err, frndDetails)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Save action failed", 500, null); 
                                reject(apiResponse);
                            } else {
                                console.log(frndDetails);                                
                                let friend={
                                    friendId:frndDetails.userId,
                                    friendName:frndDetails.firstName+" "+frndDetails.lastName
                                }
                                resolve(friend);
                            }
                        })
                    }
                })
        })
    }
//append friend request acceptor/receiver data in sender/requestor user data
    let appendUserData=(friend)=>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':data.senderId})
                .exec((err, userDetails)=>{
                    if(err){                        
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null); 
                        reject(apiResponse);
                    } else if(check.isEmpty(userDetails)){                        
                        let apiResponse=response.generate(true, "No Data found", 404, null); 
                        reject(apiResponse)
                    } else {
                        userDetails.friends.push(friend);
                        userDetails.save((err, userData)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Some Error Occurred", 500, null); 
                                reject(apiResponse);
                            } else {                                
                                userData.friend=friend;                                
                                let acceptanceData={
                                    senderId:userData.userId,
                                    senderName:userData.firstName+" "+userData.lastName,
                                    receiverId:friend.friendId,
                                    reciverName:friend.friendName
                                }
                                //userData.acceptanceData=acceptanceData;
                                resolve(acceptanceData);
                            }
                        })
                    }
                })

        })
    }

    appendFriendData()
        .then(appendUserData)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "friends data updated successfully", 200, resolve);
            friendCB(apiResponse);
        })
        .catch(err=>{
            let apiResponse=response.generate(true, "friends data updation failed", 500, err);
            friendCB(apiResponse);
        });    
}
//----------------------------------------------------------------------------------------------------------------

//-------------------------------------Notification function--------------------------------------------------
let createNotification=(data, notificationCB)=>{
    console.log("***********");
    console.log("Create Notification -- " + JSON.stringify(data));
    let newNotice=new NotificationModel({
        id:shortId.generate(),
        type:data.type,
        action:data.action,
        typeId:data.typeId,
        message:data.message,
        sendId:data.sendId,
        sendName:data.sendName
    })

    newNotice.save((err, saveNotice)=>{
        if(err){
            console.log(err);
            let apiResponse=response.generate(true, "Notification creation failed", 500, null);
            notificationCB(apiResponse);
        } else {
            console.log(saveNotice);
            let notice=saveNotice.toObject();
            delete notice._id;
            delete notice.__v;
            let apiResponse=response.generate(false, "Notification creation successful", 200, saveNotice);
            notificationCB(apiResponse); 
        }
    })
}
//-----------------------------------------------------------------------------------------------------------

let changeStatusList=(data, changeStatusListCB)=>{     
    //console.log("line 615" + model);
    ListModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusListCB(apiResponse);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusListCB(apiResponse);
            } else {
                //console.log(result);
                
                if(result.status==="open"){
                    result.status="done";
                } else if(result.status==="done"){
                    result.status="open";
                }

                result.save((err, record)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Save Action Failed : Status Change", 500, null);
                        changeStatusListCB(apiResponse);
                    } else {
                        console.log(record);
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        console.log(recordChanged);
                        let apiResponse=response.generate(false, "Status Change Successful", 200, recordChanged);
                        changeStatusListCB(apiResponse);
                    }
                })            
            }
        })
}
//------------------------------------------------------------------------------------------------------------
let changeStatusItem=(data, changeStatusItemCB)=>{     
    //console.log("line 615" + model);
    ItemModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusItemCB(apiResponse);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusItemCB(apiResponse);
            } else {
                console.log(result);
                
                if(result.status==="open"){
                    result.status="done";
                } else if(result.status==="done"){
                    result.status="open";
                }

                result.save((err, record)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Save Action Failed : Status Change", 500, null);
                        changeStatusItemCB(apiResponse);
                    } else {
                        console.log(record);
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        console.log(recordChanged);
                        let apiResponse=response.generate(false, "Status Change Successful", 200, recordChanged);
                        changeStatusItemCB(apiResponse);
                    }
                })            
            }
        })
}
//-------------------------------------------------------------------------------------------------------------------
let changeStatusSubItem=(data, changeStatusSubItemCB)=>{     
    //console.log("line 615" + model);
    SubItemModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                console.log(err);
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusSubItemCB(apiResponse);
            } else if(check.isEmpty(result)){
                console.log("No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusSubItemCB(apiResponse);
            } else {
                console.log(result);
                
                if(result.status==="open"){
                    result.status="done";
                } else if(result.status==="done"){
                    result.status="open";
                }

                result.save((err, record)=>{
                    if(err){
                        let apiResponse=response.generate(true, "Save Action Failed : Status Change", 500, null);
                        changeStatusSubItemCB(apiResponse);
                    } else {
                        console.log(record);
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        console.log(recordChanged);
                        let apiResponse=response.generate(false, "Status Change Successful", 200, recordChanged);
                        changeStatusSubItemCB(apiResponse);
                    }
                })            
            }
        })
}
//------------------------------------------------------------------------------------------------------------


//------------------------------------exporting functions------------------------------------------------------
module.exports={
    getAllLists:getAllLists,
    createList:createList,
    deleteList:deleteList,
    editList:editList,

    createItem:createItem,
    editItem:editItem,
    deleteItem:deleteItem,
    getItemsByListId:getItemsByListId,

    createSubItem:createSubItem,
    editSubItem:editSubItem,
    deleteSubItem:deleteSubItem,
    getSubItemsByItemId:getSubItemsByItemId, 

    acceptFriendRequest:acceptFriendRequest,
    //showFriendList:showFriendList,

    createNotification:createNotification,
    changeStatusList:changeStatusList,
    changeStatusItem:changeStatusItem,
    changeStatusSubItem:changeStatusSubItem    
}
//-----------------------------------------------End of file---------------------------------------------