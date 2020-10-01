//import dependencies
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//importing user defined services
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import {TaskService} from './../../task.service';
//import jquery
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy { 
  //variables for user details 
  public authToken:string;
  public pageOwnerId:string;
  public pageOwnerName:string;  
  //alternatively used for pageowner or friend
  public userId:string; 
  public fullName:string;
//arrays to store contacts , notifications , friends
  public contactList:any=[];//list of contacts
  public notificationList:any=[];//list of notifications
  public friendList:any=[];//list of friends

  public senderId:string;
  public senderName:string;
  public message:string;  
  public friendRequest=false;//boolean value - if true show complete modal or only message

  public latestNotification="";//current notification
  public lastChangeMessage="";//latest notification from any friend
  public lastChangeObject:any;//details of last change by any friend  

  constructor(//creating instances
    private UserService:UserService,
    private SocketService:SocketService,
    private TaskService:TaskService,    
    private router:Router   
  ){}

  ngOnInit(){
    //getting user info from local storage
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;    
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;
    this.userId=this.pageOwnerId;    
    this.fullName=this.pageOwnerName;
    //setting up socket connection
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    //events
    this.loadHomePage();//default page load or move from friend page
    //event listeners
    this.getHomePageLoad();//socket event handler
    this.getFriendPageLoad(); //when option to move friend page clicked   
    this.getContactListResponse();//when button to see contact is pressed - socket event handler
    this.getNotificationListResponse(); //when notification icon is pressed - socket event handler   
    this.getFriendRequest();//to send friend request
    this.getPublishNotification();//to flash notification on friend page
    this.getLastChangeObject();//to get last change object
    this.updateListPageResponse();//when list is updated -
    this.updateAfterUndoResponse();//updation after undo action
  }

  ngOnDestroy(){
    console.log("HOme component destroyed");
  }
//------------------------------------------------------------------------------------------------
//proceed further only when authToken is present
public checkStatus=():any=> {
  if (this.authToken === undefined || 
       this.authToken === '' || 
        this.authToken === null) {
        this.router.navigate(['/']);
         return false;
  } else {
    return true;
  }
} // end checkStatus
//to test socket connection 
//and then set user if authToke is valid
public verifyUserConfirmation():any{
  this.SocketService.verifyUser()
      .subscribe(
        (data)=>{
          console.log(data);
          this.SocketService.setUser(this.authToken);
        }, (err)=>{
          console.log(err);
        }
      )
}
//get list of online users
public getOnlineUserList=():any=>{
  this.SocketService.onlineUserList().subscribe(
    (data)=>{
      console.log(data);
    }
  )
}
//-----------------When Home page is loaded---by default or press of button---------------
//----function to load Home Page to fire socket event-------
public loadHomePage=():any=>{
  let data={
    pageOwnerId:this.pageOwnerId,
    userId:this.userId,    
    fullName:this.pageOwnerName,
    pageType:'self',
    event:'load-home-page'
  }  
  this.SocketService.loadHomePage(data);
}
//-----HOme Page Load --- Socket Event Handler----
public getHomePageLoad=():any=>{
  this.SocketService.getHomePageLoad()
    .subscribe((data)=>{ 
      console.log(data);                   
      this.getContactList(this.authToken, this.userId);
      this.getLatestNotification(this.authToken, this.userId);      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//When Move To Home Page button is clicked
public moveToHomePage(){
  this.loadHomePage();
}
//------------Friend Related Events and Handlers----------------------------------------------------

//----------------When a friend page is loaded ----- by clicking friend name-----------

public getFriendPageLoad=():any=>{
  this.SocketService.getFriendPageLoad()
    .subscribe((data)=>{      
      this.userId=data.userId;
      this.fullName=data.fullName;      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//---------------Sending Friend request-------------------------------------------------
//---function to send request------
public sendFriendRequest=(id, firstName, lastName):any=>{ 
  $("#contacts-modal").slideUp(1000);
  let fullName=firstName+" "+lastName; 
  let data={
    senderId:this.userId,
    senderName:this.pageOwnerName,
    receiverId:id,
    receiverName:fullName,
    event:"friend-request",
    message:this.pageOwnerName+" has sent you a friend request"
  }
  ////console.log(data);
  this.SocketService.sendFriendRequest(data);   
}
//------function get friend request from other contacts----
public getFriendRequest=():any=>{
  this.SocketService.getFriendRequest().subscribe(
    data=>{
      if(this.userId===data.receiverId){
        //console.log("friend request");
        this.friendRequest=true;
        this.senderId=data.senderId;
        this.senderName=data.senderName;
        this.message=data.message;
        $("#friendship-modal").fadeIn(2000);
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//------------When freind request is accepted-----------------------------------------
//---on click of accept button---------------
//make api call - when friend request is accepted
//to update contact list and friend list in DB
//and notify sender of request about acceptance 
public acceptFriendRequest=(senderId, senderName):any=>{
  $("#friendship-modal").fadeOut(2000);
  let data={
    userId:this.pageOwnerId,
    userName:this.pageOwnerName,
    friendId:senderId,
    friendName:senderName
  }
  this.UserService.acceptFriendRequest(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      //console.log(apiResponse);
      this.getContactList(this.authToken, this.pageOwnerId);
      this.notifyFriends(false, null);
      this.SocketService.updateFriendList({userId:this.userId, friendId:senderId});
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

//----------------------When a friend request is declined---------------------------------
//---to make disappear modal ---no other action----
public declineFriendRequest=():any=>{
  $("#friendship-modal").fadeOut(2000);
}
//-------------------Contact Related functions , event emitters and handlers-------------------------------
//api call to get contact list - when page loaded or friend request accepted
public getContactList(authToken, userId){  
  this.UserService.getContactList(authToken, userId).subscribe(
    apiResponse=>{
      //console.log(apiResponse);
      if(apiResponse.data !== null){
        this.contactList=apiResponse.data;
      }     
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
        //------------socket event handler---------------
//response of event - when contact icon is clicked
public getContactListResponse=():any=>{
  this.SocketService.getContactListResponse()
    .subscribe((data)=>{
      //console.log(data);      
      if(data.showList){
        //console.log("show contact modal");
        this.getContactList(this.authToken, this.userId);
        $("#contacts-modal").slideDown(1500);
      } else {
          $("#contacts-modal").slideUp(1000);
      }       
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//when close button of contact modal is clicked
public closeContactModal(){
  $("#contacts-modal").fadeOut(1000);  
}
//---to get friend list to send notifications---when some action with any task happens--

//function to notify friends
public notifyFriends=(showNotif, list):any=>{
  //console.log(this.userId);
  this.UserService.getFriendList(this.authToken, this.pageOwnerId).subscribe(
    apiResponse=>{
      //console.log(showNotif);
      //console.log(list);
      if(apiResponse.data !==null){
        this.friendList=apiResponse.data;
        let data={          
          friendList:this.friendList
        }
        console.log(data);
        this.SocketService.fireLastChangeEvent(data);
        if(showNotif){
          let obj={
            friendList:this.friendList,
            list:list
          }
          this.SocketService.publishNotification(obj);
        }
        
      }//if block ended      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//---------------------------Notification Related functions , event emitters and handlers---------------------
//api call to get latest notification
public getLatestNotification(authToken, userId){
  this.TaskService.getLatestNotification(authToken, userId).subscribe(
    apiResponse=>{
      //console.log("Dsnkry",apiResponse.data);
      if(apiResponse.data !== null && apiResponse.data !== undefined){
        //console.log("sljfsljfs");
        this.lastChangeObject=apiResponse.data;
        this.lastChangeMessage=this.lastChangeObject.message;
      }           
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }    
  )
}
//event handler - when notification icon click event happens
public getNotificationListResponse=():any=>{
  this.SocketService.getNotificationListResponse()
    .subscribe((data)=>{      
        if(data.showNotif){
          this.getAllNotifications(this.authToken, this.userId);
          this.showNotificationModal();
        } else {
          this.closeNotificationModal();
        } 
      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//to show all notifications modal
public showNotificationModal(){    
  $("#all-notification-modal").slideToggle(1500); 
}
//to close all notifications modal
public closeNotificationModal(){
  $("#all-notification-modal").slideUp(1000);  
}
//api call to get all notifications
public getAllNotifications(authToken, userId){
  this.TaskService.getAllNotifications(authToken, userId).subscribe(
   apiResponse=>{
     //console.log(apiResponse.data);
     this.notificationList=apiResponse.data;
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//to show latest notification 
public getPublishNotification(){  
  this.SocketService.getPublishNotification().subscribe(
    data=>{
      //console.log(data);      
         if(this.pageOwnerId===data.userId){
           this.latestNotification=data.list.message;                     
           $("#notification-modal").fadeIn(2000);            
         }
    })
}
//to show latest notification modal
public closeCurrentNotifModal(){
  $("#notification-modal").fadeOut(1000);  
}

//------------------------------------------------------------------------------------------------
//to get last change object
public getLastChangeObject=():any=>{
  this.SocketService.getLastChangeObject().subscribe(
    data=>{ 
      //console.log(data);         
      if(this.pageOwnerId===data.userId){
        //console.log(data);
        this.getLatestNotification(this.authToken, data.userId);        
      }       
    }, (error)=>{
      //console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//-------------------------------------------------------------------------------------
public updateListPageResponse=():any=>{
  this.SocketService.updateListPageResponse()
    .subscribe((data)=>{ 
      console.log(data);         
      if(this.pageOwnerId===data.list.sendId) {
          console.log(this.pageOwnerId);
          console.log(data.list.sendId);
          this.notifyFriends(true, data.list);
      }             
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//--------------------------------------------------------------------------------------
public undoLastChange(){
  let data={
    userId:this.pageOwnerId,
    notificationId:this.lastChangeObject.id,
    type:this.lastChangeObject.type,    
    action:this.lastChangeObject.action,
    id:this.lastChangeObject.typeId,
    refkey:this.lastChangeObject.refkey
  }
  //console.log(data);
  this.SocketService.undoLastAction(data);
}

public updateAfterUndoResponse(){
  this.SocketService.updateAfterUndoResponse().subscribe(
    data=>{      
      //console.log(data);
      //console.log(this.userId);
      if(data.list !== null){
        if(this.userId===data.userId || this.userId===data.list.personId){
          console.log("userId matched");          
          this.notifyFriends(false, data.list);    
        } 
      }
               
    }
  )

}
//----------------------------------------------------------------------------------------
}
//--------------------------------------------------------------------------------------
