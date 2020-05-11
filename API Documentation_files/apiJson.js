let objArray=[
    
        {
            "name":"sign-up",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/todolist/signup",
            "intro":"User will have to register himself by giving his personal details and then "+ 
                    " send a request to register him .",
            "payload":[
                {"field":"firstName", "type":"String", "description":"first name of user"},
                {"field":"lasName", "type":"String", "description":"last name of user"},
                {"field":"email", "type":"String", "description":"email address of user"},
                {"field":"password", "type":"String", "description":"password of user"},
                {"field":"mobile", "type":"String", "description":"mobile number of user"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"Sign-up successful"},
                {"field":"data", "type":"Object", "description":"details of user except password"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"login",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/todolist/login",
            "intro":"User will login by input his credentials like email and password.",
            "payload":[                
                {"field":"email", "type":"String", "description":"email address on email format"},
                {"field":"password", "type":"String", "description":"alphabet or numeric or both"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"Login successful"},
                {"field":"data", "type":"Object", "description":"Details of user except password"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"logout",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/todolist/logout",
            "intro":"By clicking logout , user will exit the application.",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId to identify user in DB and exit"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"Logout successful"},
                {"field":"data", "type":"Null", "description":"null"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"forgot-password/matchOTP",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/todolist/matchOTP/:userId",
            "intro":"User will input his email address and OTP or link will be sent to his email address."+
                    "If link is sent reset password window will open instantly."+
                    "and if OTP is sent to email , user will select reset password option",
            "payload":[                
                {"field":"email", "type":"String", "description":"email address on email format"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"OTP sent to email address"},
                {"field":"data", "type":"Null", "description":"null"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"forgot-password/reset-password",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/todolist/:email/:code",
            "intro":"User will input his new password and confirm it again. On success, user will "+
                    "redirected to login window to login.",
            "payload":[                
                {"field":"email", "type":"String", "description":"email address on email format"},
                {"field":"password", "type":"String", "description":"alphabet or numeric or both"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"Login successful"},
                {"field":"data", "type":"Object", "description":"Details of user except password"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"accept-friend",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:accept-friend/todolist/:userId",
            "intro":"This api call will be made when user will click accept friend button. On Success, user "+
                    "and friend will be added in each other's friend list.",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId of the user"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"friend request accept by the user"},
                {"field":"data", "type":"Null", "description":"null"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"forgot-password/demandOTP",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/todolist/:email",
            "intro":"User will send his email address and demand OTP . On Success, OTP and link both will be "+
                    "to his email account. He may choose any of both",
            "payload":[                
                {"field":"email", "type":"String", "description":"email address on email format"},
                {"field":"password", "type":"String", "description":"alphabet or numeric or both"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"OTP and link sent to your email account."},
                {"field":"data", "type":"Null", "description":"null"}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"friendList",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/:authToken/todolist/:userId",
            "intro":"As the home page loads, an api call to fetch friend list of user will be made.",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to fetch friend of user"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"friend list fetched successfully."},
                {"field":"data", "type":"Array of Objects", "description":"A list of friends "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"contactList",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/todolist/:userId",
            "intro":"If contacts icon is clicked - a list of contacts that are not friends will be fetched.",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to fetch list of contacts"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"Contact List of user fetched successfully."},
                {"field":"data", "type":"Array of Objects", "description":"A list of contacts. "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"listByUserId",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/todolist/all-lists/:userId",
            "intro":"On home page load, all lists of a user are fetched .",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to fetch lists of a user"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":" Lists of a user fetched successfully."},
                {"field":"data", "type":"Array of Objects", "description":"All lists of a user "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"allNotifications",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/:authToken/todolist/all-notifications/:userId",
            "intro":"If notification icon is clicked - a list of notifications to a user will be fetched.",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to fetch list of notifications"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"All notifications to user fetched successfully."},
                {"field":"data", "type":"Array of Objects", "description":"A list of notifications. "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"latestNotification",
            "reqMode":"GET",
            "url":"http://bestbuddy.in/:authToken/todolist/latest-notification/:userId",
            "intro":"latest notification will be fetched regarding item, sub-item created/edited/deleted. ",
            "payload":[                
                {"field":"userId", "type":"String", "description":"latest notification sent by any friend of user is fetched."}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"Latest notification fetched successfully."},
                {"field":"data", "type":"Object", "description":"Details of latest notification."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"create-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/create-list/:userId",
            "intro":"On being input name , user will get created and shown list in list component.  ",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to keep list related with userId"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List created successfully."},
                {"field":"data", "type":"Object", "description":"User will get notification details of list created. "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"delete-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/delete-list/:userId",
            "intro":"On clicking delete button - list will be deleted ",
            "payload":[                
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} 
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List deleted successfully."},
                {"field":"data", "type":"Object", "description":"User will get notification details of list deleted. "}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"edit-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/edit-list/:userId",
            "intro":"On clicking edit , changing name of list and submit - list will be edited. ",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId"},
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} ,
                {"field":"listName", "type":"String", "description":"new listName will replace the old one."}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List edited successfully."},
                {"field":"data", "type":"Object", "description":" notification details of list edited."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"change-status-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/change-status-list",
            "intro":"On clicking -open or done - status will be changed to the other. ",
            "payload":[                
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} 
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List status changed successfully."},
                {"field":"data", "type":"Object", "description":" notification details of list status changed."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"undo-create-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/undo-create-list/:userId",
            "intro":"On clicking undo - if in last action list was created - will be undone. ",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId - to keep list related with userId"}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List created undone successfully."},
                {"field":"data", "type":"Object", "description":"User will get details of list under action."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },
        {
            "name":"undo-delete-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/undo-delete-list/:userId",
            "intro":"On clicking delete button - list will be deleted ",
            "payload":[                
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} 
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List deletion undone successfully."},
                {"field":"data", "type":"Object", "description":"User will get details of list under action."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        },         
        {
            "name":"undo-edit-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/undo-edit-list/:userId",
            "intro":"On clicking edit , changing name of list and submit - list will be edited. ",
            "payload":[                
                {"field":"userId", "type":"String", "description":"userId"},
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} ,
                {"field":"listName", "type":"String", "description":"new listName will replace the old one."}
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List edited undone successfully."},
                {"field":"data", "type":"Object", "description":"User will get details of list under action."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }, 
        {
            "name":"undo-change-status-list",
            "reqMode":"POST",
            "url":"http://bestbuddy.in/:authToken/todolist/undo-change-status-list",
            "intro":"On clicking -open or done - status will be changed to the other. ",
            "payload":[                
                {"field":"listId", "type":"String", "description":"List will be identified by listId."} 
            ],
            "success":[
                {"field":"error", "type":"Boolean", "description":"false"},
                {"field":"status", "type":"Number", "description":"200"},
                {"field":"message", "type":"String", "description":"List status change undone successfully."},
                {"field":"data", "type":"Object", "description":" User will get details of list under action."}              
            ], 
            "error":[
                {"field":"error", "type":"Boolean", "description":"true"},
                {"field":"status", "type":"Number", "description":"404 or 500"},
                {"field":"message", "type":"String", "description":"No Data Found or Some internal error"},
                {"field":"data", "type":"Null", "description":"null"}                 
            ]  
        }

    
]





/*   
    app.post(baseUrl+'/:authToken/undo-create-list', auth.isAuthorised,  taskController.undoCreateList);
    app.post(baseUrl+'/:authToken/undo-edit-list', auth.isAuthorised,  taskController.undoEditList);
    app.post(baseUrl+'/:authToken/undo-delete-list', auth.isAuthorised,  taskController.undoDeleteList);

    app.get(baseUrl+'/:authToken/items-by-listId/:userId/:listId', auth.isAuthorised, taskController.getItemsByListId);
    app.post(baseUrl+'/:authToken/create-item/:userId', auth.isAuthorised, taskController.createItem);
    app.post(baseUrl+'/:authToken/edit-item/:userId', auth.isAuthorised, taskController.editItem);
    app.post(baseUrl+'/:authToken/delete-item/:userId', auth.isAuthorised, taskController.deleteItem);
    app.post(baseUrl+'/:authToken/change-item-status/:userId', auth.isAuthorised, taskController.changeItemStatus);
    app.post(baseUrl+'/:authToken/undo-create-item', auth.isAuthorised,  taskController.undoCreateItem);
    app.post(baseUrl+'/:authToken/undo-delete-item', auth.isAuthorised,  taskController.undoDeleteItem);
    app.post(baseUrl+'/:authToken/undo-edit-item', auth.isAuthorised,  taskController.undoEditItem);

    app.get(baseUrl+'/:authToken/sub-items-by-itemId/:userId/:itemId', auth.isAuthorised, taskController.getSubItemsByItemId);
    app.post(baseUrl+'/:authToken/create-sub-item/:userId', auth.isAuthorised, taskController.createSubItem);
    
    app.post(baseUrl+'/:authToken/edit-sub-item/:userId', auth.isAuthorised, taskController.editSubItem);
    app.post(baseUrl+'/:authToken/delete-sub-item/:userId', auth.isAuthorised, taskController.deleteSubItem);
    
    app.post(baseUrl+'/:authToken/change-sub-item-status/:userId', auth.isAuthorised, taskController.changeSubItemStatus);
    
    app.post(baseUrl+'/:authToken/undo-create-sub-item', auth.isAuthorised,  taskController.undoCreateSubItem);
    app.post(baseUrl+'/:authToken/undo-delete-sub-item', auth.isAuthorised,  taskController.undoDeleteSubItem);

    app.post(baseUrl+'/:authToken/undo-edit-sub-item', auth.isAuthorised,  taskController.undoEditSubItem);
    */