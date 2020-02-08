// ***************** Include Packages *****************
const mongoose=require('mongoose');
const shortId=require('shortid');


//****************** Include Libraries ****************
const response=require('./responseLib');
const check=require('./checkLib');

//****************** Include Models ******************
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


//****************** NotificationModel *****************
/* Function - getAllLists
*  Fetches all lists basis data
*  Args :
*  	data : Contains userId basis which data is to be fetched
*  	allListsCB : Callback once lists have been fetched
*  Response:
*  	error : true; "Some error Occurred" or "No Data Found"
*  	error : false; "All Lists Data fetched successfully" 
*
*/
let getAllLists=(data, allListsCB)=>{
    logger.debug("FunctionsLib:: getAllLists " + JSON.stringify(data));
    ListModel.find({'creatorId':data.userId, 'isActive':true})
        .exec((err, allLists)=>{
            if(err){
                logger.debug("FunctionsLib:: getAllLists" + err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                allListsCB(apiResponse);
            } else if(check.isEmpty(allLists)){                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allListsCB(apiResponse);
            } else {
                logger.debug("FunctionsLib:: getAllLists " + "Matching data found");
                let apiResponse=response.generate(false, "All Lists Data fetched successfully", 200, allLists);
                apiResponse.socketLoginId=data.userId;
                logger.debug("FunctionsLib:: getAllLists " + JSON.stringify(apiResponse));
                allListsCB(apiResponse);
            }
        })
}

/* Function - createList
 * Creates a List
 * Args :
 * 	data : Contains listName, creatorId, createdBy
 * 	listData : Callback once list is created
 * Response:
 * 	error : true; List creation - save action failed
 * 	error : false; List created successfully
 */
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
logger.debug("FunctionsLib:: createList New List Object created - " + JSON.stringify(newList) + " Payload received " + JSON.stringify(data));
    newList.save((err, list)=>{
        if(err){
            logger.debug("FunctionsLib:: createList  " + err);
            let apiResponse=response.generate(true, "List creation - save action failed", 500, null);
            listData(apiResponse);
        } else {
            let listObj=list.toObject();
            delete listObj._id;
            delete listObj.__v; 
            listObj.type="list";
            listObj.action="create";
            let apiResponse=response.generate(false, "List created successfully", 200, listObj);
            logger.debug("FunctionsLib:: createList " + apiResponse);
            listData(apiResponse);
        }
    })
}


/* Function : editList
 * Edit a list
 * Args : 
 * 	data (contains listId and edit payload)
 * Response:
 * 	error : true, Edit action failed after deletion
 * 		true, No data found
 *		true, Save old list action failed
 *		false
 */
let editList=(data, editListCB)=>{
    logger.debug("FunctionsLib::editList " + JSON.stringify(data));
    let saveOldList=()=>{
        return new Promise((resolve, reject)=>{
        ListModel.findOne({'originId':data.listId, 'isActive':true})
         .exec((err, oldList)=>{
            if(err){
                logger.debug("FunctionsLib::editList  " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(oldList)){
                logger.debug("FunctionsLib::editList " + "No Data found");
                let apiResponse=response.generate(true, "No data found", 404, null);
                reject(apiResponse);
            } else {                
                oldList.isActive=false;                                   
            
                oldList.save((err, oldListData)=>{
                    if(err){
                        logger.debug("FunctionsLib::editList " + JSON.stringify(err));
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
                    logger.debug("FunctionsLib " + err);
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                   
                    reject(apiResponse);
                } else {
                    let editedList=savedList.toObject();
                    delete editedList._id;
                    delete editedList.__v;
                    editedList.action=data.action;
                    editedList.type=data.type;
                    logger.debug("FunctionsLib::editList :: createNewList " + JSON.stringify(editedList));
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

/* Function : deleteList
 * Delete a list
 * Args : 
 * 	data : Contains listId to be deleted
 * 	listData : Callback on list deletion
 * Response:
 * 	error : true; Delete action failed: some error
 * 		true; No data found
 *		false; List deleted successfully
 */
let deleteList=(data, listData)=>{    
    ListModel.findOne({'originId':data.listId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::deleteList " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Delete action failed : some error", 500, null);
                listData(apiResponse);
            } else if(check.isEmpty(result)){
                // logger.debug("FunctionsLib " + "No  data found");
                let apiResponse=response.generate(true, "No  data found", 404, null);
                listData(apiResponse);
            } else {
                result.isActive=false;
                result.save((err, deletedList)=>{
                    if(err){
                        logger.debug("FunctionsLib::deleteList " + JSON.stringify(err));
                    } else {
                        logger.debug("FunctionsLib::deleteList  " + JSON.stringify(deletedList));
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


//function - to create item
/* Function : createItem
 * Creates an item
 * Args : 
 * 	Data : Contains details of item to be created
 * 	itemCB : Callback to be called on successful list creation
 * Response:
 * 	error : true; "Create Item : Save action failed"
 * 		false; "Data created successfully"
 */
let createItem=(data, itemCB)=>{
    let randomId=shortId.generate(); 
    logger.debug("FunctionsLib::createItem " + JSON.stringify(data) + randomId);

    let newItem=new ItemModel({
        itemId:randomId,
        itemName:data.itemName,        
        createdOn:Date.now(),
        createdBy:data.createdBy,
        creatorId:data.creatorId,
        listId:data.listId, 
        originId:randomId        
    });
    logger.debug("FunctionsLib::createItem " + JSON.stringify(newItem));
    //save - item created in DB
    newItem.save((err, newItem)=>{
        if(err){
            logger.debug("FunctionsLib::createItem " + JSON.stringify(err));
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


/* Function editItem
 * Edit an existing item
 * Args : 
 * 	data : Edit item with payload
 * 	editItemCB : Callback to call on editting an item
 * Response : 
 * 	error : true; Edit action failed
 * 	error : true; No data found
 * 	error : true; Save in Edit action failed
 * 	error : false ; Item edited successfully; item payload
 *
 */
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
                        logger.debug("FunctionsLib::editItem " + JSON.stringify(err));
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
                    logger.debug("FunctionsLib::createNewItem  " + err);
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
            logger.debug("FunctionsLib " + apiResponse);                   
            editItemCB(apiResponse);
        })
        .catch((err)=>{                               
            editItemCB(err);
        })
            
                      
}

/* Function : deleteItem
 * Args : 
 * 	data : Item to be deleted
 * 	itemData : Callback on deletion of item
 * Response: 
 * 	error : true; Edit action failed after deletion
 *	error : false : Item Deleted successfully 
 */
let deleteItem=(data, itemData)=>{
    ItemModel.findOne({'originId':data.itemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::deleteItem " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Edit action failed after deletion", 500, null);
                itemData(apiResponse);                
            } else if(check.isEmpty(result)){
                logger.debug("FunctionsLib::deleteItem " + "No  data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                itemData(apiResponse);
            } else {
                result.isActive=false;
                
                result.save((err, deletedItem)=>{
                    if(err){
                        logger.debug("FunctionsLib::deleteItem " + JSON.stringify(err));
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


/* Function : To get Items Using listId
 * Args : 
 * 	data : Contains listId to fetch items of
 * 	allItemsCB : Callback after fetching items for a listId
 * Response : 
 * 	error : true; Item fetching by listId failed
 * 	error : true; no data found - due to origin id
 * 	error : true; no data found - no problem of origin id
 * 	error : false ; All items of list fetched successfully
 */
let getItemsByListId=(data, allItemsCB)=>{
    logger.debug("FunctionsLib::getItemsByListId " + "data in getItemByListId : "+ JSON.stringify(data));    
    ItemModel.find({'listId':data.listId, 'isActive':true})
        .exec((err, allItems)=>{
            if(err){                
                let apiResponse=response.generate(true, "Items fetching by listId failed", 500, null);
                allItemsCB(apiResponse)
            } else if(check.isEmpty(allItems)){
                logger.debug("FunctionsLib::getItemsByListId " + "no data found - due to origin id");                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allItemsCB(apiResponse);
            } else {
                logger.debug("FunctionsLib::getItemsByListId " + "no data found - no problem of  origin id");
                let apiResponse=response.generate(false, "All items of list fetched successfully", 200, allItems)
                apiResponse.socketLoginId=data.userId;
                apiResponse.listName=data.listName;
                allItemsCB(apiResponse);
            }
        })
}

/* Function : createSubItem
 * Create sub item
 * Args : 
 * 	data : Data to create a subitem
 * 	subItemCB : Callback on creation of subitem
 * Response : 
 * 	true; Save action failed after sub item creation
 * 	false; Sub Item created successfully
 */
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
            logger.debug("FunctionsLib::createSubItem " + err);           
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


/* Function: Edit Sub Item 
 * Args :
 * 	data : SubItemId and details for sub item edition
 * 	editSubItemCB : Callback on sub item edit
 * Response : 
 * 	error : true; Edit action failed : Some Error
 * 	error : true; EditSubItem : No Data found
 * 	Error : false; 
 */
let editSubItem=(data, editSubItemCB)=>{
    logger.debug("FunctionsLib::editSubItem " + data);
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
                        logger.debug("FunctionsLib::editSubItem " + err);
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
                        logger.debug("FunctionsLib " + err);
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
            logger.debug("FunctionsLib " + resolve);
            let apiResponse=response.generate(false, "sub item edited successfully", 200, resolve);
            editSubItemCB(apiResponse);
        })
        .catch((err)=>{
            
            editSubItemCB(err);
        })
}

/* Function : deleteSubItem
 * Args : 
 * 	data: Contains subItemId
 * 	subItemData : Callback on deletion of subItem
 * Response:
 * 	true; Deletion failed : Some error
 *	true : No data found
 *	false : Sub Item deleted successfully
 */
let deleteSubItem=(data, subItemData)=>{    
    SubItemModel.findOne({'originId':data.subItemId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::deleteSubItem " + err);
                let apiResponse=response.generate(true, "Deletion failed : Some Error", 500, null);
                subItemData(apiResponse);                
            } else if(check.isEmpty(result)){
                logger.debug("FunctionsLib::deleteSubItem " + "No  data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                subItemData(apiResponse);
            } else {
                logger.debug("FunctionsLib::deleteSubItem " + JSON.stringify(result));
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

/* Function : getSubItemsByItemId
 * Args : 
 * 	data : Contains itemId to fetch sub item for
 *	allSubItemsCB : Callback to call on fetching sub items basis itemId
 * Response:
 * 	true : Some Error Occurred
 * 	true : No Data Found
 * 	false : All Items of List fetched successfully
 */
let getSubItemsByItemId=(data, allSubItemsCB)=>{
    logger.debug("FunctionsLib::getSubItemsByItemId " + "in getSubItemsByItemId function");
    logger.debug("FunctionsLib::getSubItemsByItemId  " + JSON.stringify(data));
    SubItemModel.find({'itemId':data.itemId, 'isActive':true})
        .exec((err, allSubItems)=>{
            if(err){
                logger.debug("FunctionsLib " + err);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                allSubItemsCB(apiResponse);
            } else if(check.isEmpty(allSubItems)){
                logger.debug("FunctionsLib " + "No Data found");
                let apiResponse=response.generate(true, "No Data found", 404, null);
                allSubItemsCB(apiResponse);
            } else {
                let apiResponse=response.generate(false, "All items of list fetched successfully", 200, allSubItems)
                apiResponse.socketLoginId=data.userId;
                allSubItemsCB(apiResponse);
            }
    })
}

/* Function : acceptFriendRequest
 * Args : 
 * 	data : receiverId 
 * 	friendCB : Callback once friend request is accepted
 * Response : 
 *	error : true : Some Error Occurred
 *		true : No Data Found
 *		false : friendId, friendName
 *
 */
let acceptFriendRequest=(data, friendCB)=>{
    //append friend request sender data in receiver/acceptor user data
    let appendFriendData=()=>{        
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userId':data.receiverId})
                .exec((err, friendDetails)=>{
                    if(err){
                        logger.debug("FunctionsLib::acceptFriendRequest " + err);
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);                
                        reject(apiResponse);
                    } else if(check.isEmpty(friendDetails)){
                        logger.debug("FunctionsLib::acceptFriendRequest " + "No Data found");
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
                                logger.debug("FunctionsLib::acceptFriendRequest " + JSON.stringify(frndDetails));                                
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

//-------------------------------------Notification function--------------------------------------------------

let createNotification=(data, notificationCB)=>{
    logger.debug("FunctionsLib " + "***********");
    logger.debug("FunctionsLib " + "Create Notification -- " + JSON.stringify(data));
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
            logger.debug("FunctionsLib " + err);
            let apiResponse=response.generate(true, "Notification creation failed", 500, null);
            notificationCB(apiResponse);
        } else {
            logger.debug("FunctionsLib " + saveNotice);
            let notice=saveNotice.toObject();
            delete notice._id;
            delete notice.__v;
            let apiResponse=response.generate(false, "Notification creation successful", 200, saveNotice);
            notificationCB(apiResponse); 
        }
    })
}


/* Function : changeStatusList
 * Args :
 * 	data : Contains originId
 * 	changeStatusListCB : Callback on change status list
 * Response : 
 * 	error : true : Status Change Failed
 * 	error : true : No Data Found
 * 	error : false : Status Change successful
 */
let changeStatusList=(data, changeStatusListCB)=>{     
    logger.debug("FunctionsLib::changeStatusList " + "line 615" + model);
    ListModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::changeStatusList " + JSON.stringify(err));
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusListCB(apiResponse);
            } else if(check.isEmpty(result)){
                logger.debug("FunctionsLib::changeStatusList " + "No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusListCB(apiResponse);
            } else {
                logger.debug("FunctionsLib::changeStatusList " + JSON.stringify(result));
                
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
                        logger.debug("FunctionsLib::changeStatusList " + JSON.stringify(record));
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        logger.debug("FunctionsLib::changeStatusList " + JSON.stringify(recordChanged));
                        let apiResponse=response.generate(false, "Status Change Successful", 200, recordChanged);
                        changeStatusListCB(apiResponse);
                    }
                })            
            }
        })
}




/* Function : changeStatusItem
 * Change status of an item 
 * Args : 
 * 	data : Contains originId(identifies an item),
 * 	changeStatusItemCB : Callback on changing status of item
 * Response : 
 * 	error : true: Status Change Failed
 * 		true : No Data Found
 * 		false : Status Change Successful
 */
let changeStatusItem=(data, changeStatusItemCB)=>{     
    logger.debug("FunctionsLib::changeStatusItem " + "line 615" + model);
    ItemModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::changeStatusItem " + err);
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusItemCB(apiResponse);
            } else if(check.isEmpty(result)){
                logger.debug("FunctionsLib::changeStatusItem " + "No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusItemCB(apiResponse);
            } else {
                logger.debug("FunctionsLib::changeStatusItem " + result);
                
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
                        logger.debug("FunctionsLib::changeStatusItem " + record);
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        logger.debug("FunctionsLib::changeStatusItem " + recordChanged);
                        let apiResponse=response.generate(false, "Status Change Successful", 200, recordChanged);
                        changeStatusItemCB(apiResponse);
                    }
                })            
            }
        })
}

/* Function changeStatusSubItem
 * Change status of a sub item
 * Args : 
 * 	data : Contains subItemId to change subItem for
 * 	changeStatusSubItemCB : Callback on changing status of subitem
 * Response : 
 * 	error : true : Status Change Failed
 * 		true : No Data Found
 * 		false : Status Change Successful
 */
let changeStatusSubItem=(data, changeStatusSubItemCB)=>{     
    logger.debug("FunctionsLib::changeStatusSubItem " + "line 615" + model);
    SubItemModel.findOne({'originId':data.originId, 'isActive':true})
        .exec((err, result)=>{
            if(err){
                logger.debug("FunctionsLib::changeStatusSubItem " + err);
                let apiResponse=response.generate(true, "Status Change Failed", 500, null);
                changeStatusSubItemCB(apiResponse);
            } else if(check.isEmpty(result)){
                logger.debug("FunctionsLib::changeStatusSubItem " + "No Data found");
                let apiResponse=response.generate(true, "No Data  Found", 404, null);
                changeStatusSubItemCB(apiResponse);
            } else {
                logger.debug("FunctionsLib::changeStatusSubItem " + result);
                
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
                        logger.debug("FunctionsLib::changeStatusSubItem " + record);
                        let recordChanged=record.toObject();
                        delete recordChanged.__v;
                        delete recordChanged._id;
                        recordChanged.type=data.type;
                        logger.debug("FunctionsLib::changeStatusSubItem " + recordChanged);
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
