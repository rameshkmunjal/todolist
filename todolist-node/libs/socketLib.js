//including packages
const socketio=require('socket.io');
const shortId=require('shortid');
//including files
const redisLib=require('./redisLib');
const tokenLib=require('./tokenLib');
const emailLib=require('./emailLib');
const functionLib=require('./functionLib');


let setServer=(server)=>{
    let io=socketio.listen(server);
    let myIo=io.of('/');

    myIo.on('connection', (socket)=>{
        socket.emit('verify-user', 'ram-ram');
        console.log("*******************Socket at server side set up********************");
        //--------------------------set user event listener----------------------------------
        socket.on('set-user', (authToken)=>{
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user)=>{
                if(err){
                    console.log(err);
                    console.log("Please provide correct authToken");
                } else {
                    console.log("user is verified . setting up details");
                    let currentUser=user.data;
                    socket.userId=currentUser.userId;
                    /*
                    getAllLists(socket.userId, function(allListsCB){
                        myIo.emit('get-all-lists', allListsCB);
                    });
*/
                    //let fullName=`${currentUser.firstName} ${currentUser.lastName}`;
                    let key=currentUser.userId;
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;
                    let value=fullName;
                    console.log(key , value);
/*
                    redisLib.setNewOnlineUserInHash('onlineusers', key, value, (err, result)=>{
                        console.log("inside getAllUsersInAHash function");
                        if(err){
                            console.log(JSON.stringify(err));
                        } else {
                            console.log("else block of setNewOnlineUserInHash");
                            console.log(result);
                            // getting online users list.
                            redisLib.getAllUsersInHash('onlineusers', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {
*/                                     
                                      //console.log("else block of getAllUsersInHash");
                                      //console.log(result);
                                      socket.room="task";
                                      socket.join(socket.room);  
                                      socket.to(socket.room).broadcast.emit('online-user-list', fullName);
/*                                      
                                    }
                                }) //redisLib function ended                               
                            }//else ended
                    })//---------end of setOnlineUserInHash function----------------------
*/
                }//end of else block - user as result
            })//----verifyClaimsWithoutSecret ended----------------------------------------
        })//-------------------end of set-user event listener------------------------------
        socket.on('get-all-lists', (data)=>{
            console.log(data);
    
            functionLib.getAllLists(data, function(allListsCB){
                console.log("all lists data fetched");
                console.log(allListsCB);
                           
                myIo.emit('get-all-lists-message', allListsCB);
            })
        })//create-task event ended
        socket.on('create-list', (data)=>{
            console.log(data);            
            data.listId=shortId.generate();            
    
            functionLib.createList(data, function(listData){
                console.log("New List created");
                console.log(listData);
                           
                myIo.emit('create-list-message', listData);
            })
        })//create-task event ended
        socket.on('edit-list', (data)=>{
            console.log(data);
            functionLib.editList(data, function(editListCB){
                console.log("list edited");
                myIo.emit('edit-list-message', editListCB);
            })
        })

        socket.on('delete-list', (listId)=>{            
            console.log("delete-list event is being handled  : " + JSON.stringify(listId)) ;
            functionLib.deleteList(listId, function(listData){
                console.log("list deleted");
                console.log(listData);                           
                myIo.emit('delete-list-message', listData);
                myIo.emit('vacate-item-box', "Select List to show items");
                myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
            })
        })//create-task event ended
        socket.on('send-list-details-to-item-box', (listName)=>{
            console.log(listName);
            myIo.emit('get-list-details-in-item-box', listName);
        })
        
        socket.on('send-item-details-to-sub-item-box', (data)=>{
            console.log(data);
            myIo.emit('get-item-details-in-sub-item-box', data);
        })
//-----------------------------------------------------------------------------------------------
        socket.on('add-new-item', (data)=>{ 
            console.log("handing add-new-item event");           
            console.log(data);
            functionLib.createItem(data, function(itemCB){
                console.log(itemCB);
            })
        })

        socket.on('edit-item', (data)=>{ 
            console.log("handing edit-item event");           
            console.log(data);
            functionLib.editItem(data, function(editItemCB){
                console.log("edit item result received in callback");
                console.log(editItemCB);
                myIo.emit('edit-item-message', editItemCB);
            })
        })

        socket.on('delete-item', (data)=>{            
            console.log("delete-item event is being handled  : " + data.itemId) ;
            functionLib.deleteItem(data, function(itemData){
                console.log("item deleted");
                console.log(itemData);                           
                myIo.emit('delete-item-message', itemData);
            })
        })//create-task event ended
        

        socket.on('items-by-list-id', (data)=>{
            console.log("inside items-by-list-id  : "+JSON.stringify(data));
            functionLib.getItemsByListId(data, function(allItemsCB){
                console.log(allItemsCB);                
                myIo.emit('get-all-items', allItemsCB);
                myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
            })
        })

        socket.on('add-new-sub-item', (data)=>{            
            console.log("handing add-new-sub-item event");           
            console.log(data);
            functionLib.createSubItem(data, function(subItemCB){
                console.log(subItemCB);
            })
        })

        socket.on('edit-sub-item', (data)=>{            
            console.log("handing edit-sub-item event");           
            console.log(data);
            functionLib.editSubItem(data, function(editSubItemCB){
                //console.log(editSubItemCB);
                myIo.emit('edit-sub-item-message', editSubItemCB);
            })
        })

        socket.on('delete-sub-item', (data)=>{
            console.log("delete-sub-item event is being handled  : " + data.itemId) ;
            functionLib.deleteSubItem(data, function(subItemData){
                console.log("subItem deleted");
                console.log(subItemData);                           
                myIo.emit('delete-sub-item-message', subItemData);
            })
        })

        socket.on('sub-items-by-item-id', (data)=>{
            console.log("inside sub-items-by-item-id  : "+data);
            
            functionLib.getSubItemsByItemId(data, function(allSubItemsCB){                
                console.log(allSubItemsCB);
                myIo.emit('get-all-sub-items', allSubItemsCB);
            })
            
        })
        //---------------------friend related events listening---------------------------------
        socket.on('send-friend-request', (data)=>{
            myIo.emit('msg-to-friend', data);
        })

        socket.on("accept-friend-request", (data)=>{
            console.log("including user as friend is being handled ");
            functionLib.acceptFriendRequest(data, function(friendCB){
                console.log(friendCB);
                myIo.emit('friend-accept-message', friendCB);
            })
        })

        socket.on("show-friend-list", (userId)=>{
            console.log("show friend list event being handled");
            functionLib.showFriendList(userId, function(friendListCB){
                console.log(friendListCB);
                myIo.emit('get-friend-list', friendListCB);
            })
        })
        socket.on("send-friend-details", (data)=>{
            console.log(data);
            myIo.emit('get-friend-details', data);
            myIo.emit('vacate-item-box', "Select List to show items");
            myIo.emit('vacate-sub-item-box', "Select Item to show sub-items");            
        })
        //-------------------disconnect socket - function defined------------------------------
        socket.on('disconnect', ()=>{
            console.log("socket connection disconnected");

            if(socket.userId){
                //redisLib.deleteUserFromHash('onlineusers', socket.userId);
               // redisLib.getAllUsersInHash('onlineusers', (err, result)=>{
                    //if(err){
                    //    console.log(err);
                    //} else {
                        socket.leave(socket.room);
                        socket.to(socket.room).broadcast.emit('online-user-list', socket.userId);
                    //}
               // })
            }
        })
        //-----------------------------end of disconnect----------------------------------


    })//------------------------------on connection ended----------------------------------   
}//end of setServer function

module.exports={
    setServer:setServer
}
//------------------------------------------------------------------------------------------



