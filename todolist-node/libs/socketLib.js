//including packages
//********************************* Including Packages *********************
const express=require('express');
const socketio=require('socket.io');
// ************************* Including User defined libraries *************************
const redisLib=require('./redisLib');
const tokenLib=require('./tokenLib');

let setServer=(server)=>{
    let io=socketio.listen(server);
    let myIo=io.of('/');

    /*
     * EventHandler - 
     */

    myIo.on('connection', (socket)=>{
		//console.log("Event::connection - Emit verify-user");
        socket.emit('verify-user', 'ram-ram');
        console.log("*******************Socket at server side set up********************");
        
    	/*
     	* EventHandler - Event::set-user : On successful connection getting established
     	*/
        socket.on('set-user', (authToken)=>{
            //console.log("Event::set-user - Set User called for " + socket.id);
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user)=>{
                if(err){
                    console.log(err);
                    //console.log("Event::set-user - Please provide correct authToken");
                } else {
                    //console.log("Event::set-user - user is verified . setting up details");
                    let currentUser=user.data;
                    //console.log("Event::set-user - " + currentUser);
                    socket.userId=currentUser.userId;
                    //console.log("Event::set-user - socket user id :"+ socket.userId);
                    
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
		socket.on('load-home-page-event', (data)=>{
			socket.emit('get-home-page-load', data);
        })
        socket.on('load-friend-page-event', (data)=>{
            console.log(data);
            socket.emit('get-friend-page-load', data);
        })
        socket.on('show-contact-list-event', (data)=>{
            console.log(data);
            socket.emit('get-contact-list-response', data);
        })
        socket.on('send-friend-request-event', (data)=>{
            console.log(data);
            myIo.emit('send-friend-request-response', data);
        })
        socket.on('accept-friend-request-event', (data)=>{
            console.log(data);
            myIo.emit('accept-friend-request-response', data);
        })
        socket.on('update-friend-event', (data)=>{
            console.log(data);
            myIo.emit('update-friend-response', data);
            
        })
        socket.on('public-notification-event', (data)=>{
            console.log(data);
            let friendList=data.friendList;
            delete data.friendList;
            for(let i=0; i<friendList.length; i++){
                let friendId=friendList[i].friendId;
                data.userId=friendId;
                console.log(data);
                myIo.emit('public-notification-response', data);                
            }
        });
        socket.on('show-notification-list-event', (data)=>{
            console.log(data);
            socket.emit('get-notification-list-response', data);
        })
        socket.on('list-click-event', (data)=>{
            socket.emit('list-click-response', data);
            socket.emit('vacate-sub-item-box', "sub-item");
        })
        socket.on('item-click-event', (data)=>{
            console.log(data);
            socket.emit('item-click-response', data);
        })
        socket.on('update-list-page-event', (data)=>{
            console.log(data);
            myIo.emit('update-list-page-response', data);
        })
        socket.on('latest-change-event', (data)=>{
            console.log(data);
            console.log("***************************************");
                let friendList=[];
                friendList=data.friendList;
                delete data.friendList;
                
                    for(let i=0; i < friendList.length; i++){ 
                        let friendId=friendList[i].friendId;                    
    
                        let data={
                            userId:friendId
                        }
                        myIo.emit('get-last-change-object', data);                
                    }
        })

        socket.on('undo-last-action', (data)=>{            
            socket.emit('undo-last-action-response', data);
        })

        socket.on('update-after-undo', (data)=>{            
            myIo.emit('update-after-undo-response', data);
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



