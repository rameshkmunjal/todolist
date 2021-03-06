let listenerArray=[    
    {
        "name":"verifyUser",
        "event":"verify-user",
        "mode":"listener",        
        "description":"This event (verify-user) has to be listened on the user's end to verify user authentication"+
        "user will only be set as online user after verification of authentication token."        
    },
    {        
        "name":"onlineUserList",
        "event":"online-user-list",       
        "mode":"listener",        
        "description":"This event (online-user-list) has to be listened on the user's end to get list of "+
        "online users."        
    },
    {  //Ok
        "name":"getHomePageLoad",
        "event":"get-home-page-load",
        "mode":"listener",        
        "description":"This event (get-home-page-load) will be listened by default on successful login of " +
            "with navigation to Home Page . While listening 1) in home component - api call to fetch contact list "+
            "notification list is made  2) in friend list component - api call to fetch list of friends is made. "        
    },
    {//ok
        "name":"getFriendPageLoad",
        "event":"get-friend-page-load",
        "mode":"listener",        
        "description":"This event (get-friend-page-load) is listened when uses selects a friend from friend list " +
            "Friend Page is loaded . Consequently list related friend is displayed. "         
    }, 
    {
        "name":"getContactListResponse",
        "event":"get-contact-list-response",
        "mode":"listener",        
        "description":"Socket event response relating contact icon click is handled and an api call"+
            "is made to fetch contact list from backend DB and contact modal is shown."           
    },
    {
        "name":"getNotificationListResponse",
        "event":"get-notification-list-response",
        "mode":"listener",        
        "description":"Socket event response relating notification icon click is handled and an api call"+
             "is made to fetch notification list from backend DB and notification modal is shown."           
    },
     
    {
        "name":"getFriendRequest",
        "event":"get-friend-request",
        "mode":"listener",        
        "description":"When a user sends a friend request , listener handles the event at friend user end"+
                "and displays the friend request as a modal with options to reject or accept."        
    },
    {
        "name":"getPublishNotification",
        "event":"publish-notification-response",
        "mode":"listener",        
        "description":"This event (publish-notification-response) listener is used to publish notification"+
            "as socket emits response to the event (publish-notification-event)."        
    }, 
    {
        "name":"getLastChangeObject",
        "event":"get-last-change-object",
        "mode":"listener",        
        "description":"This handler listens (get-last-change-object) event and makes api call to get last change object."
                    
    },    
    {
        "name":"updateListPageResponse",
        "event":"update-list-page-response",
        "mode":"listener",        
        "description":"When a user creates/deletes/edits/changes list/item/sub-item. An event (update-list-page) is emitted "+
        "to update user page. In response to socket - this handler listens the event and updates two components. In respective"+
        "list/item/sub-item component it updates the page and in home component - it send notification to friends of user and fetches"+
        "last change object to display in info bar."        
    },
    {
        "name":"updateAfterUndoResponse",
        "event":"update-after-undo-response",
        "mode":"listener",        
        "description":"This event listener (update-after-undo-response) after getting response from socket updates "+
            "user page."        
    },    
    {
        "name":"listClickResponse",
        "event":"list-click-response",
        "mode":"listener",        
        "description":"When user clicks a list , list-clicked event is emitted and in response from socket, this event "+
            "(list-click-response) is listened and consequently an api call to fetch items relating list is made."

    },
    {
        "name":"itemClickResponse",
        "event":"list-click-response",
        "mode":"listener",        
        "description":"When user clicks an item , item-clicked event is emitted and in response from socket, this event "+
        "(item-click-response) is listened and consequently an api call to fetch sub-items relating item is made."
    },
    {
        "name":"vacateSubItemBox",
        "event":"vacate-sub-item-box",
        "mode":"listener",        
        "description":"This event listens (vacate-sub-item-box) event and vacates the sub-item box when a new item is "+
        "item is created or user switches to another item from the present one."        
    }    
]

/*
    {//Ok
        "name":"getFriendsUpdated",
        "event":"update-friend-response",
        "mode":"listener",        
        "description":"This event is listened both at user and friend level - when friend request is accepted " +
            "and friend list in pages of both users is updated by making an api call . "        

    },
    
    {//ok
        "name":"getFriendRequest",
        "event":"send-friend-request-response",
        "mode":"listener",        
        "description":"When a friend request is sent by user by selecting a contact from contact list , an event is emitted"+
            "and request is sent to the friend. In response from socket , friend page listens this event (get-friend-request-response)."
    },

        {
        "name":"undoLastActionResponse",
        "event":"undo-last-action-response",
        "mode":"listener",        
        "description":"This event (undo-last-action-response) is emitted from socket in response to pressing undo button"+
            "and this handler further diverts to respective api calls."           
    },
    {
        "name":"undoLastActionResponse",
        "event":"undo-last-action-response",
        "mode":"listener",        
        "description":"This event (undo-last-action-response) is emitted from socket in response to pressing undo button"+
            "and this handler further diverts to respective api calls."           
    },
    */ 
//---------------------------------------------------------------------------------------------------

let emitterArray=[    
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
        "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"load-home-page-event",
        "mode":"emitter", 
        "payload":[
            {"field":"fullName", "type":"String", "description":"full name of user"},
            {"field":"pageType", "type":"String", "description":"pageType - Home"},
            {"field":"event", "type":"String", "description":"home-page-load"},
            {"field":"pageOwnerId", "type":"String", "description":"id of pageOwner"},
            {"field":"userId", "type":"String", "description":"id of user"}
        ],       
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
        "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"load-friend-page-event",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
        "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"send-friend-request-event",
        "mode":"emitter",
        "payload":[
            {"field":"senderId", "type":"String", "description":"id of friend request sender "},
            {"field":"senderName", "type":"String", "description":"name of friend request sender"},
            {"field":"receiverId", "type":"String", "description":"id of friend request receiver"},
            {"field":"receiverName", "type":"String", "description":"name of friend request receiver"},
            {"field":"event", "type":"String", "description":"event - friend-request"},
            {"field":"message", "type":"String", "description":"message of friend request"}
        ],        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
        "user will only be set as online user after verification of authentication token."               
    },
    {
        "name":"undo-last-action",
        "mode":"emiter", 
        "payload":[
            {"field":"userId", "type":"String", "description":"id of pageOwner "},
            {"field":"notificationId", "type":"String", "description":"id of notification "},
            {"field":"type", "type":"String", "description":"type of notification data like list or item"},
            {"field":"action", "type":"String", "description":"action - notification is about- like create or delete"},
            {"field":"id", "type":"String", "description":"id of type like list or item "}, 
            {"field":"refkey", "type":"String", "description":"refkey i.e. previous list or item of current"}
        ],       
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."            
    },
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."        
    },
    {
        "name":"set-user",
        "mode":"emitter",        
        "description":"This event (verifyUser) has to be listened on the user's end to verify user authentication"+
            "user will only be set as online user after verification of authentication token."        
    }

]

/*
public setUser(authToken){
  this.socket.emit('set-user', authToken);
}
public loadHomePage(data){
  this.socket.emit('load-home-page-event', data);
}
public loadFriendPage(data){
  ////console.log(data);
  this.socket.emit('load-friend-page-event', data);
}
public showContactList(data){
  //console.log(data);
  this.socket.emit('show-contact-list-event', data);
}
public sendFriendRequest(data){
  ////console.log(data);
  this.socket.emit('send-friend-request-event', data);
}
public acceptFriendRequest(data){
  ////console.log(data);
  this.socket.emit('accept-friend-request-event', data);
}
public updateFriendList(data){
  ////console.log(data);
  this.socket.emit('update-friend-event', data);
}
public showNotificationList(data){
  ////console.log(data);
  this.socket.emit('show-notification-list-event', data);
}
public publishNotification(data){
  ////console.log(data);
  this.socket.emit('public-notification-event', data); 
}
public fireLastChangeEvent(data){
  console.log(data);
  this.socket.emit('latest-change-event', data);
}

*/