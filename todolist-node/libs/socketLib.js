//including packages
//********************************* Including Packages *********************
const socketio=require('socket.io');
const shortId=require('shortid');


// ************************* Including User defined libraries *************************
const redisLib=require('./redisLib');
const tokenLib=require('./tokenLib');
const userLib=require('./userLib');
const functionLib=require('./functionLib');
const listLib=require('./listLib');
const itemLib=require('./itemLib');
const subItemLib=require('./subItemLib');


let setServer=(server)=>{
    let io=socketio.listen(server);
    let myIo=io.of('/');

    /*
     * EventHandler - 
     */

    myIo.on('connection', (socket)=>{
		console.log("Event::connection - Emit verify-user");
        socket.emit('verify-user', 'ram-ram');
        console.log("*******************Socket at server side set up********************");
        
    	/*
     	* EventHandler - Event::set-user : On successful connection getting established
     	*/
        socket.on('set-user', (authToken)=>{
            console.log("Event::set-user - Set User called for " + socket.id);
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user)=>{
                if(err){
                    console.log(err);
                    console.log("Event::set-user - Please provide correct authToken");
                } else {
                    console.log("Event::set-user - user is verified . setting up details");
                    let currentUser=user.data;
                    console.log("Event::set-user - " + currentUser);
                    socket.userId=currentUser.userId;
                    console.log("Event::set-user - socket user id :"+ socket.userId);
                    
                    let key=currentUser.userId;
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;
                    let value=fullName;
                    console.log(key , value, socket.id);

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
                                      socket.room="task";
                                      socket.join(socket.room);  
                                      socket.to(socket.room).broadcast.emit('online-user-list', result);                                      
                                    }
                                }) //redisLib function ended                               
                            }//else ended
                    })//---------end of setOnlineUserInHash function----------------------

                }//end of else block - user as result
            })//----verifyClaimsWithoutSecret ended----------------------------------------
        })//-------------------end of set-user event listener------------------------------
        
        
        
    	/*
     	* EventHandler - Event::send-list-details-to-item-box : 
     	*/
        socket.on('send-list-details-to-item-box', (data)=>{ 
		console.log("Event::send-list-details-to-item-box " + JSON.stringify(data));
		console.log("Event::send-list-details-to-item-box Emitting get-list-details-in-item-box ");
                myIo.emit('get-list-details-in-item-box', data);
                       
        })
        
    	/*
     	* EventHandler - Event::send-item-details-to-sub-item-box connection 
     	*/
        socket.on('send-item-details-to-sub-item-box', (data)=>{
            console.log("Event::send-item-details-to-sub-item-box Send List Details to Sub Item called for "+ socket.id + JSON.stringify(data));
            console.log("Event::send-item-details-to-sub-item-box Emitting get-item-details-in-sub-item-box");
	    myIo.emit('get-item-details-in-sub-item-box', data);
        })
    


     /**************************************** Events to Manage lists  **********************************
     /*
     * EventHandler - Event::get-all-lists : 
     */
            socket.on('get-all-lists', (data)=>{
                functionLib.getAllLists(data, function(allListsCB){
		    console.log("Event::get-all-lists Emitting get-all-lists-message");
                    myIo.emit('get-all-lists-message', allListsCB);
                })
            })


    	/*
     	* EventHandler - Event::items-by-list-id 
     	*/
        socket.on('items-by-list-id', (data)=>{            
            functionLib.getItemsByListId(data, function(allItemsCB){
                console.log("Event::items-by-list-id allItemsCB result "+ JSON.stringify(allItemsCB));    
		console.log("Event::items-by-list-id Emitting get-all-items");
                myIo.emit('get-all-items', allItemsCB);
                myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
            })
        })



    	/*
     	* EventHandler - Event::sub-items-by-item-id
     	*/
        socket.on('sub-items-by-item-id', (data)=>{
            console.log("Event::sub-items-by-item-id inside sub-items-by-item-id  : "+JSON.stringify(data));
            
            functionLib.getSubItemsByItemId(data, function(allSubItemsCB){             
                console.log("Event::sub-items-by-item-id Emitting get-all-sub-items");
                myIo.emit('get-all-sub-items', allSubItemsCB);
            })            
        })
      
	    /*
	     * EventHandler :: Event::delete-task 
	     */
	    socket.on('delete-task', (data)=>{
		    console.log("Event::delete-task "+ JSON.stringify(data));
		    if(data.type==="list"){                
			    functionLib.deleteList(data, function(listData){ 

				    console.log("Event::delete-task - Emitting get-success-message");
				    myIo.emit('get-success-message', listData);

				    console.log("Event::delete-task - Emitting vacate-item-box");
				    myIo.emit('vacate-item-box', "Select List to show items");

				    console.log("Event::delete-task - Emitting vacate-sub-item-box");
				    myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
			    })        
		    } else if(data.type==="item"){                
			    functionLib.deleteItem(data, function(itemData){                 
				    console.log("Event::delete-task Emitting get-success-message");
				    myIo.emit('get-success-message', itemData);
			    })        
		    } else if(data.type==="subItem"){                
			    functionLib.deleteSubItem(data, function(subItemData){            
				    console.log("Event::delete-task Emitting get-success-message");
				    myIo.emit('get-success-message', subItemData);       
			    }) 
		    } //else ended        
	    })

	    /*
	     * EventHandler :: Event::create-task 
	     */
	    socket.on('create-task', (data)=>{
		    console.log("Event::create-task " + JSON.stringify(data));
		    if(data.type==="list"){                
			    functionLib.createList(data, function(listData){                       

				    console.log("Event::create-task Emitting get-success-message");
				    myIo.emit('get-success-message', listData);

				    console.log("Event::create-task Emitting vacate-item-box");
				    myIo.emit('vacate-item-box', "Select List to show items");

				    console.log("Event::create-task Emitting vacate-sub-item-box");
				    myIo.emit('vacate-sub-item-box', "Select Item to show sub-items"); 
			    })        
		    } else if(data.type==="item"){                
			    functionLib.createItem(data, function(itemCB){           
				    console.log("Event::create-task Emitting get-success-message Item");
				    myIo.emit('get-success-message', itemCB);
			    })       
		    } else if(data.type==="subItem"){                
			    functionLib.createSubItem(data, function(subItemCB){           
				    console.log("Event::create-task Emitting get-success-message SubItem");
				    myIo.emit('get-success-message', subItemCB);
			    })       
		    }          
	    })

	    /*
	     * EventHandler :: Event::edit-task
	     */
	    socket.on('edit-task', (data)=>{
		    console.log("Event::edit-task line number 164 : " + JSON.stringify(data));
		    if(data.type==="list"){                
			    functionLib.editList(data, function(editListCB){ 
				    //console.log("**************************");
				    //console.log(editListCB);           
				    console.log("Event::edit-task Emitting get-success-message List");
				    myIo.emit('get-success-message', editListCB);
			    })        
		    } else if(data.type==="item"){                
			    functionLib.editItem(data, function(editItemCB){            

				    console.log("Event::edit-task Emitting get-success-message Item");
				    myIo.emit('get-success-message', editItemCB);
			    })        
		    } else if(data.type==="subItem"){                
			    functionLib.editSubItem(data, function(editSubItemCB){ 
				    console.log("Event::edit-task Emitting get-success-message SubItem");
				    myIo.emit('get-success-message', editSubItemCB);
			    })        
		    }          
	    })

	    /*
	     * EventHandler :: Change Status- 
	     */
	    socket.on('change-status', (data)=>{
		    console.log("Event::change-status " + JSON.stringify(data));
		    if(data.type==="list"){
			    functionLib.changeStatusList(data, function(changeStatusListCB){
				    console.log("Event::change-status Emitting get-change-status-list");
				    myIo.emit('get-change-status-list', changeStatusListCB);
			    })        
		    } else if(data.type==="item"){
			    functionLib.changeStatusItem(data, function(changeStatusItemCB){
				    console.log("Event::change-status Emitting get-change-status-item ");
				    myIo.emit('get-change-status-item', changeStatusItemCB);
			    })
		    } else if(data.type==="subitem"){
			    functionLib.changeStatusSubItem(data, function(changeStatusSubItemCB){
				    console.log("Event::change-status Emitting get-change-status-sub-item ");
				    myIo.emit('get-change-status-sub-item', changeStatusSubItemCB);
			    })
		    }            
	    })  


	    /*
	     * EventHandler::undo-delete  
	     */
	    socket.on('undo-delete', (data)=>{
		    console.log("Event::undo-delete " + JSON.stringify(data));
		    if(data.type==="list"){                
			    listLib.undoDeleteList(data, function(undoChangeListCB){ 
				    console.log("Event::undo-delete Emitting undo-success-message List");
				    myIo.emit('undo-success-message', undoChangeListCB);
			    })        
		    } else if(data.type==="item"){                
			    itemLib.undoDeleteItem(data, function(undoChangeItemCB){                                     
				    console.log("Event::undo-delete Emitting undo-success-message Item");
				    myIo.emit('undo-success-message', undoChangeItemCB);
			    })        
		    } else if(data.type==="subItem"){                
			    subItemLib.undoDeleteSubItem(data, function(undoChangeSubItemCB){                                      
				    console.log("Event::undo-delete Emitting undo-success-message SubItem");
				    myIo.emit('undo-success-message', undoChangeSubItemCB);
			    })        
		    }          
	    }) 

	    /*
	     * EventHandler::undo-create  
	     */
	    socket.on('undo-create', (data)=>{
		    console.log("Event::undo-create " + JSON.stringify(data));
		    if(data.type==="list"){                
			    listLib.undoCreateList(data, function(undoCreateListCB){                                      
				    console.log("Event::undo-create Emitting undo-success-message List");
				    myIo.emit('undo-success-message', undoCreateListCB);
			    })        
		    } else if(data.type==="item"){                
			    itemLib.undoCreateItem(data, function(undoCreateItemCB){
				    console.log("Event::undo-create Emitting undo-success-message Item");
				    myIo.emit('undo-success-message', undoCreateItemCB);
			    })        
		    } else if(data.type==="subItem"){                
			    subItemLib.undoCreateSubItem(data, function(undoCreateSubItemCB){                                      
				    console.log("Event::undo-create Emitting undo-success-message SubItem");
				    myIo.emit('undo-success-message', undoCreateSubItemCB);
			    })        
		    }          
	    }) 
   
	    /*
	     * EventHandler::undo-edit - 
	     */
	    socket.on('undo-edit', (data)=>{
		    console.log(data);
		    if(data.type==="list"){                
			    listLib.undoEditList(data, function(undoEditListCB){                                      
				    console.log("Event::undo-edit Emitting undo-success-message List");
				    myIo.emit('undo-success-message', undoEditListCB);
			    })        
		    } else if(data.type==="item"){                
			    itemLib.undoEditItem(data, function(undoEditItemCB){                                      
				    console.log("Event::undo-edit Emitting undo-success-message Item");
				    myIo.emit('undo-success-message', undoEditItemCB);
			    })        
		    } else if(data.type==="subItem"){                
			    subItemLib.undoEditSubItem(data, function(undoEditSubItemCB){                                      
				    console.log("Event::undo-edit Emitting undo-success-message SubItem");
				    myIo.emit('undo-success-message', undoEditSubItemCB);
			    })        
		    }          
	    })
	    /*
	     * EventHandler::send-friend-request - 
	     */
	    socket.on('send-friend-list', (data)=>{
		    userLib.getFriendList(data, (friendCB)=>{
				myIo.emit('get-friend-list', friendCB);
			})		    
	    })		
	    /*
	     * EventHandler::send-friend-request - 
	     */
	    socket.on('send-friend-request', (data)=>{
		    data.message=data.senderName+" has sent you a friend request ";
		    
		    console.log("Event::send-friend-request " + data.receiverId);
		    console.log("Event::send-friend-request Emitting to reciever");
		    myIo.emit(data.receiverId, data);
	    })

	    /*
	     * EventHandler::accept-friend-request 
	     */
	    socket.on("accept-friend-request", (data)=>{
		    console.log("Event::accept-friend-request :: accept-friend-request is being handled ");
		    functionLib.acceptFriendRequest(data, function(friendCB){
			    console.log(friendCB);
			     let obj={
                    receiverName : friendCB.data.receiverName,
                    senderName : friendCB.data.senderName,
                    receiverId : friendCB.data.receiverId,
                    senderId : friendCB.data.senderId,
                    message :receiverName+" has accepted " + senderName + " friendRequest",
                    msgType:"general"
                }
                
                myIo.emit('msg-friend-request-accept', obj);
                
	      })
	    })

	    /*
	     * EventHandler::send-user-details 
	     */
	    socket.on("send-user-details", (data)=>{
		    console.log(data);
		    console.log("Event send-user-details :: Emitting get-user-details");
		    myIo.emit('get-user-details', data);
		    
		    console.log("Event send-user-details :: Emitting vacate-item-box");
		    myIo.emit('vacate-item-box', "Select List to show items");
		    
		    console.log("Event send-user-details :: Emitting vacate-sub-item-box");
		    myIo.emit('vacate-sub-item-box', "Select Item to show sub-items");            
	    })
            socket.on("get-contact-list", (data)=>{
              userLib.getContactList(data, function(contactCB){
                console.log("contact list : " + JSON.stringify(contactCB));
                contactCB.pageOwnerId=data.pageOwnerId;
                myIo.emit('show-contact-list', contactCB);
            })

        })

	    //---------------------------Notifications--------------------------------------------
	    /*
	     * EventHandler::send-current-notification- 
	     */
	    socket.on("send-current-notification", (data)=>{
		    console.log("Event send-current-notification " + JSON.stringify(data));
		    functionLib.createNotification(data, function(notificationCB){
			    console.log("Event send-current-notification Emitting get-current-notification");
			    myIo.emit('get-current-notification', notificationCB);
	
		    })                      
		})
		
		socket.on('send-message-to-friend', (data)=>{
			myIo.emit(data.receiverId, data);
		})

	    /*
	     * EventHandler::show-all-notifications 
	     */
	    socket.on("show-all-notifications", (data)=>{
		    console.log("Event show-all-notifications " + JSON.stringify(data));
		    functionLib.getAllNotifications(data, function(notificationCB){
			    console.log("Event show-all-notifications Emitting get-all-notifications");
			    myIo.emit('get-all-notifications', notificationCB);
		    }) 
	    })
	    /*
	     * EventHandler::send-notifications-array 
	     */
	    socket.on('send-notifications-array', (data)=>{
		    console.log("Event send-notifications-array " + JSON.stringify(data));
		    console.log("Event send-notifications-array Emitting get-notification-array");
		    myIo.emit('get-notification-array', data);
	    })

	    //-------------------disconnect socket - function defined------------------------------
	    /*
	     * EventHandler::disconnect 
	     */
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



