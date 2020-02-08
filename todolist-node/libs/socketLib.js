//including packages
const socketio=require('socket.io');
const shortId=require('shortid');
//including files
const redisLib=require('./redisLib');
const tokenLib=require('./tokenLib');
const emailLib=require('./emailLib');
const functionLib=require('./functionLib');
const listLib=require('./listLib');
const itemLib=require('./itemLib');
const subItemLib=require('./subItemLib');


let setServer=(server)=>{
    let io=socketio.listen(server);
    let myIo=io.of('/');

    myIo.on('connection', (socket)=>{
        socket.emit('verify-user', 'ram-ram');
        //console.log("Socket Id is " + socket.id)
        console.log("*******************Socket at server side set up********************");
        //--------------------------set user event listener----------------------------------
        socket.on('set-user', (authToken)=>{
            console.log("Set User called for " + socket.id);
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user)=>{
                if(err){
                    console.log(err);
                    console.log("Please provide correct authToken");
                } else {
                    console.log("user is verified . setting up details");
                    let currentUser=user.data;
                    console.log(currentUser);
                    socket.userId=currentUser.userId;
                    console.log("socket user id :"+ socket.userId);
                    /*
                    getAllLists(socket.userId, function(allListsCB){
                        myIo.emit('get-all-lists', allListsCB);
                    });
*/
                    //let fullName=`${currentUser.firstName} ${currentUser.lastName}`;
                    let key=currentUser.userId;
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;
                    let value=fullName;
                    console.log(key , value, socket.id);
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
                                      console.log(socket);
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
        
        
        
        socket.on('send-list-details-to-item-box', (data)=>{            
                console.log(data);
                myIo.emit('get-list-details-in-item-box', data);
                       
        })
        
        socket.on('send-item-details-to-sub-item-box', (data)=>{
            console.log("Send List Details to Sub Item called for "+ socket.id);
            console.log(data);
            myIo.emit('get-item-details-in-sub-item-box', data);
        })
//-------------------------------------Lists-------------------------------------------------
            socket.on('get-all-lists', (data)=>{            
                //console.log("GEt all lists called for " +   socket.id);
                functionLib.getAllLists(data, function(allListsCB){               
                    console.log("Sending get all lists message to socket");
                    //myIo.to(`${socket.userId}`).emit('get-all-lists-message', allListsCB);            
                    myIo.emit('get-all-lists-message', allListsCB);
                })
            })


        socket.on('items-by-list-id', (data)=>{
            console.log("Items by ListId called for "+ socket.id);
            console.log("inside items-by-list-id  : "+JSON.stringify(data));
            functionLib.getItemsByListId(data, function(allItemsCB){
                //console.log(allItemsCB);                
                myIo.emit('get-all-items', allItemsCB);
               // myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
            })
        })



        socket.on('sub-items-by-item-id', (data)=>{
            console.log("inside sub-items-by-item-id  : "+data);
            
            functionLib.getSubItemsByItemId(data, function(allSubItemsCB){             
                
                myIo.emit('get-all-sub-items', allSubItemsCB);
            })            
        })
//----------------------------------CRUD operations------------------------------------------------
//-----------------------------------delete task---------------------------------------- 
      
socket.on('delete-task', (data)=>{
    console.log(data);
    if(data.type==="list"){                
        functionLib.deleteList(data, function(listData){ 
                                                  
            myIo.emit('get-success-message', listData);
            myIo.emit('vacate-item-box', "Select List to show items");
            myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
        })        
    } else if(data.type==="item"){                
        functionLib.deleteItem(data, function(itemData){                                       
            myIo.emit('get-success-message', itemData);
        })        
    } else if(data.type==="subItem"){                
        functionLib.deleteSubItem(data, function(subItemData){                                     
            myIo.emit('get-success-message', subItemData);       
        }) 
    } //else ended        
})
 
//-------------------------------create-task----------------------------------------
socket.on('create-task', (data)=>{
    console.log(data);
    if(data.type==="list"){                
        functionLib.createList(data, function(listData){                       
            myIo.emit('get-success-message', listData);
            myIo.emit('vacate-item-box', "Select List to show items");
            myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
        })        
    } else if(data.type==="item"){                
        functionLib.createItem(data, function(itemCB){            
            myIo.emit('get-success-message', itemCB);
        })       
    } else if(data.type==="subItem"){                
        functionLib.createSubItem(data, function(subItemCB){            
            myIo.emit('get-success-message', subItemCB);
        })       
    }          
}) 
//---------------------------edit ---------------------------------------------- 
socket.on('edit-task', (data)=>{
    console.log("line number 164 : "+JSON.stringify(data));
    if(data.type==="list"){                
        functionLib.editList(data, function(editListCB){ 
            //console.log("**************************");
            //console.log(editListCB);           
            myIo.emit('get-success-message', editListCB);
        })        
    } else if(data.type==="item"){                
        functionLib.editItem(data, function(editItemCB){            
            myIo.emit('get-success-message', editItemCB);
        })        
    } else if(data.type==="subItem"){                
        functionLib.editSubItem(data, function(editSubItemCB){ 
            console.log(editSubItemCB);           
            myIo.emit('get-success-message', editSubItemCB);
        })        
    }          
})

//----------------------------------------changeStatus-----------------------------------------------        
        socket.on('change-status', (data)=>{
            console.log(data);
            if(data.type==="list"){
                functionLib.changeStatusList(data, function(changeStatusListCB){
                    myIo.emit('get-change-status-list', changeStatusListCB);
                })        
            } else if(data.type==="item"){
                functionLib.changeStatusItem(data, function(changeStatusItemCB){
                    myIo.emit('get-change-status-item', changeStatusItemCB);
                })
            } else if(data.type==="subitem"){
                functionLib.changeStatusSubItem(data, function(changeStatusSubItemCB){
                    myIo.emit('get-change-status-sub-item', changeStatusSubItemCB);
                })
            }            
        })  
 //---------------------------------undo action----------------------------------------------------        
        socket.on('undo-delete', (data)=>{
            console.log(data);
            if(data.type==="list"){                
                listLib.undoDeleteList(data, function(undoChangeListCB){
                    console.log("callback successful"); 
                    let apiResponse=undoChangeListCB;
                    console.log(apiResponse);                   
                    myIo.emit('get-success-message', apiResponse);
                })        
            } else if(data.type==="item"){                
                itemLib.undoDeleteItem(data, function(undoChangeItemCB){
                    console.log("callback successful"); 
                    let apiResponse=undoChangeItemCB;
                    console.log(apiResponse);                   
                    myIo.emit('get-success-message', apiResponse);
                })        
            } else if(data.type==="subItem"){                
                subItemLib.undoDeleteSubItem(data, function(undoChangeSubItemCB){
                    console.log("callback successful"); 
                    let apiResponse=undoChangeSubItemCB;
                    console.log(apiResponse);                   
                    myIo.emit('get-success-message', apiResponse);
                })        
            }          
        }) 
        //-------------------------------undo create-----------------------------------------
        socket.on('undo-create', (data)=>{
            console.log(data);
            if(data.type==="list"){                
                listLib.undoCreateList(data, function(undoCreateListCB){                                      
                    myIo.emit('get-success-message', undoCreateListCB);
                })        
            } else if(data.type==="item"){                
                itemLib.undoCreateItem(data, function(undoCreateItemCB){
                    console.log("callback successful");                                       
                    myIo.emit('get-success-message', undoCreateItemCB);
                })        
            } else if(data.type==="subItem"){                
                subItemLib.undoCreateSubItem(data, function(undoCreateSubItemCB){                                      
                    myIo.emit('get-success-message', undoCreateSubItemCB);
                })        
            }          
        }) 
       //---------------------------undo edit ---------------------------------------------- 
        socket.on('undo-edit', (data)=>{
            console.log(data);
            if(data.type==="list"){                
                listLib.undoEditList(data, function(undoEditListCB){                                      
                    myIo.emit('get-success-message', undoEditListCB);
                })        
            } else if(data.type==="item"){                
                itemLib.undoEditItem(data, function(undoEditItemCB){                                      
                    myIo.emit('get-success-message', undoEditItemCB);
                })        
            } else if(data.type==="subItem"){                
                subItemLib.undoEditSubItem(data, function(undoEditSubItemCB){                                      
                    myIo.emit('get-success-message', undoEditSubItemCB);
                })        
            }          
        })
//------------------------------------------friend related events listening---------------------------------
        socket.on('send-friend-request', (data)=>{
            data.message=data.senderName+" has sent you a friend request ";
            //console.log(message);
            //socket.broadcast.to(data.userId).emit(message);
            //socket.broadcast.to(data.id).emit('get-message', message);
            console.log(data.receiverId);
            myIo.emit(data.receiverId, data);
        })

        socket.on("accept-friend-request", (data)=>{
            console.log("accept-friend-request is being handled ");
            functionLib.acceptFriendRequest(data, function(friendCB){
                console.log(friendCB);
                myIo.emit('friend-accept-message', friendCB);
            })
        })

        socket.on("send-user-details", (data)=>{
            console.log(data);
            myIo.emit('get-user-details', data);
            myIo.emit('vacate-item-box', "Select List to show items");
            myIo.emit('vacate-sub-item-box', "Select Item to show sub-items");            
        })
        //---------------------------Notifications--------------------------------------------
        socket.on("send-current-notification", (data)=>{
            //console.log(data);
            functionLib.createNotification(data, function(notificationCB){
                myIo.emit('get-current-notification', notificationCB);
            })                      
        })

        socket.on("show-all-notifications", (data)=>{
            console.log(data);            
            myIo.emit('show-notifications', data);
            
        })
        socket.on('send-notifications-array', (data)=>{
            console.log(data);
            myIo.emit('get-notification-array', data);
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



