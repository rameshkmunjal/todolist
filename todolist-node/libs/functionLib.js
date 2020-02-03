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
require('./../models/item');
const ItemModel=mongoose.model('Itm');
require('./../models/subitem');
const SubItemModel=mongoose.model('subItem');
//---------------------------------------------------------------------------------------------
//function - to get all lists 
let getAllLists=(data, allListsCB)=>{
    //console.log(data.userId);
    ListModel.find({'changeId':data.userId})
        .exec((err, allLists)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                allListsCB(apiResponse);
            } else if(check.isEmpty(allLists)){
                //console.log("Line No. 19 - No List Data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allListsCB(apiResponse);
            } else {
                //console.log("Matching data found");
                let apiResponse=response.generate(false, "All Lists Data fetched successfully", 200, allLists);
                allListsCB(apiResponse);
            }
        })
}
//---------------------------------------------------------------------------------------------
//function - to create list 
let createList=(data, listData)=>{
    let newList=new ListModel({
        listId:data.listId,        
        listName:data.listName,
        changeOn:Date.now(),
        changeId:data.creatorId,
        changeBy:data.createdBy           
    })
//saving in DB
    newList.save((err, list)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "List creation - save action failed", 500, null);
            listData(apiResponse);
        } else {
            let listObj=list.toObject();
            delete listObj._id;
            delete listObj.__v; 
            let apiResponse=response.generate(false, "List created successfully", 200, listObj);
            listData(apiResponse);
        }
    })
}
//--------------------------------------------------------------------------------------------------------
//function - to edit list
let editList=(data, editListCB)=>{    
    ListModel.findOne({'listId':data.listId})
        .exec((err, newList)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                editListCB(apiResponse);
            } else if(check.isEmpty(newList)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                editListCB(apiResponse);
            } else {       
                newList.listName=data.listName;                      
                newList.changeOn=Date.now();    
                newList.changeId=data.modifierId;
                newList.chaneBy=data.modifierName;                                     
            } 
            //to save - edited list 
            newList.save((err, updatedList)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Save action after Edit failed after deletion", 500, null);
                        editListCB(apiResponse);
                    } else { 
                        let apiResponse=response.generate(false, "List edited successfully", 200, updatedList);                   
                        editListCB(apiResponse);
                    }
            })
        })    
}
//---------------------------------------------------------------------------------------------------------
//function - to delete list 
let deleteList=(listId, listData)=>{    
    ListModel.findOneAndRemove({listId:listId.listId})
        .exec((err, result)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Delete action failed : some error", 500, null);
                listData(apiResponse);
            } else if(check.isEmpty(result)){
                //console.log("No  data found");
                let apiResponse=response.generate(true, "No  data found", 404, null);
                listData(apiResponse);
            } else {
                let apiResponse=response.generate(false, "List Deleted Successfully", 200, result);
                listData(apiResponse);
            }
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to create item
let createItem=(data, itemCB)=>{    
    let newItem=new ItemModel({
        itemId:shortId.generate(),
        itemName:data.itemName,        
        changeOn:Date.now(),
        changeBy:data.changeBy,
        changeId:data.changeId,
        listId:data.listId
    });
    //save - item created in DB
    newItem.save((err, updatedList)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "Save action failed after deletion", 500, null);
            itemCB(apiResponse);
        } else {
            let apiResponse=response.generate(false, "Data saved after deletion successfully", 200, updatedList);
            itemCB(apiResponse);            
        }
    })            
}
//------------------------------------------------------------------------------------------------------
//function - to edit item
let editItem=(data, editItemCB)=>{    
    ItemModel.findOne({'itemId':data.itemId})
        .exec((err, newList)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                editItemCB(apiResponse);
            } else if(check.isEmpty(newList)){
                //console.log("No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                editItemCB(apiResponse);
            } else {       
                newList.itemName=data.itemName;                      
                newList.changeOn=Date.now();    
                newList.changeId=data.modifierId;
                newList.chaneBy=data.modifierName;                                     
            } 
            //save - edited item in DB
            newList.save((err, updatedList)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Save action after Edit failed after deletion", 500, null);
                        editItemCB(apiResponse);
                    } else { 
                        let apiResponse=response.generate(false, "Item edited successfully", 200, updatedList);                   
                        editItemCB(apiResponse);
                    }
            })
        })    
}
//---------------------------------------------------------------------------------------------------------
//function - to delete item
let deleteItem=(data, itemData)=>{
    ItemModel.findOneAndRemove({'itemId':data.itemId})
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
                let apiResponse=response.generate(false, "Item Deleted successfully", 200, result);
                itemData(apiResponse);                
            }
        })
}
//-------------------------------------------------------------------------------------------------------
//function - to get items using list id
let getItemsByListId=(data, allItemsCB)=>{    
    ItemModel.find({listId:data.listId})
        .exec((err, allItems)=>{
            if(err){                
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                allItemsCB(apiResponse)
            } else if(check.isEmpty(allItems)){                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allItemsCB(apiResponse);
            } else {
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
    let newSubItem=new SubItemModel({
        subItemId:shortId.generate(),
        subItemName:data.subItemName,    
        changeOn:Date.now(),
        changeBy:data.changeBy,
        changeId:data.changeId,
        listId:data.listId,
        itemId:data.itemId,
        itemName:data.itemName
    });
    // to save created sub item in DB
    newSubItem.save((err, updatedList)=>{
        if(err){
            //console.log(err);
            let apiResponse=response.generate(true, "Save action failed after sub item creation", 500, null);
            subItemCB(apiResponse);
        } else {
            let apiResponse=response.generate(false, "Sub Item created successfully", 200, updatedList);
            subItemCB(apiResponse);
        }
    })            
}
//-------------------------------------------------------------------------------------------------------------
//function - to edit item 
let editSubItem=(data, editSubItemCB)=>{
    //console.log(data);
    SubItemModel.findOne({'subItemId':data.subItemId})
        .exec((err, newList)=>{
            if(err){
                //console.log(err);
                let apiResponse=response.generate(true, "Edit action failed : Some Error", 500, null);
                editSubItemCB(apiResponse);
            } else if(check.isEmpty(newList)){
                //console.log("EditSubItem : No Data found");
                let apiResponse=response.generate(true, "EditSubItem : No Data found", 404, null);
                editSubItemCB(apiResponse)
            } else {  
                //console.log(newList);     
                newList.subItemName=data.subItemName;                      
                newList.changeOn=Date.now();    
                newList.changeId=data.modifierId;
                newList.chaneBy=data.modifierName;                                     
            } 
            //save edited sub item in DB
            newList.save((err, updatedList)=>{
                    if(err){
                        //console.log(err);
                        let apiResponse=response.generate(true, "Save action failed : Sub Item edition", 500, null);                   
                        editSubItemCB(apiResponse);
                    } else { 
                        let apiResponse=response.generate(false, "Sub Item edited successfully", 200, updatedList);                   
                        editSubItemCB(apiResponse);
                    }
            })
        })
}
//---------------------------------------------------------------------------------------------------------------
//function - to delete sub item 
let deleteSubItem=(data, subItemData)=>{    
    SubItemModel.findOneAndRemove({'subItemId':data.subItemId})
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
                let apiResponse=response.generate(false, "Sub Item deleted successfully", 200, result);
                subItemData(apiResponse);
            }   
        })
}
//----------------------------------------------------------------------------------------------------------
//function - to get sub items using item id
let getSubItemsByItemId=(data, allSubItemsCB)=>{
    //console.log("in getSubItemsByItemId function");
    //console.log(data.itemId);
    SubItemModel.find({'itemId':data.itemId})
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
    //append friend data in user data
    let appendFriendData=()=>{        
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':data.friendId})
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
                        let fullName=friendDetails.firstName+" "+friendDetails.lastName;
                        let temp={
                            friendId:data.userId,
                            fullName:data.fullName
                        }
                        friendDetails.friends.push(temp);

                        friendDetails.save((err, frndDetails)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Save action failed", 500, null); 
                                reject(apiResponse);
                            } else {
                                console.log(frndDetails);                                
                                let friend={
                                    friendId:data.friendId,
                                    fullName:fullName
                                }
                                resolve(friend);
                            }
                        })
                    }
                })
        })
    }

    let appendUserData=(friend)=>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':data.userId})
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
                                resolve(userData);
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
//function - to show friend list
let showFriendList=(userId, friendListCB)=>{
    UserModel.findOne({'userId':userId})
        .exec((err, user)=>{
            if(err){                
                let apiResponse=response.generate(true, "friend list creation failed", 500, null);
                friendListCB(apiResponse);
            } else if(check.isEmpty(user)){                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                friendListCB(apiResponse);
            } else {
                let friendsArr=user.friends;
                let apiResponse=response.generate(false, "Friend List fetched successfully", 200, friendsArr);
                friendListCB(apiResponse);
            }
        })
}
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
    showFriendList:showFriendList
}
//-----------------------------------------------End of file---------------------------------------------