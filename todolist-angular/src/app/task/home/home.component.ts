import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import * as $ from 'jquery';
//import { TaskService } from 'src/app/task.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public authToken:string;

  public userId:string; 
  public fullName:string;

  public pageOwnerId:string;
  public pageOwnerName:string;

  public pageType="self";

  public message:string;

  public friendId:string;
  public friendName:string;
  public friendList:any=[];

  public receiverId:string;
  public receiverName:string;
  public senderId:string;
  public senderName:string;

  public userList:any=[];
  public actionWord:string;
  public friendRequest=false;
  
  public notificationList:any=[];
  public lastChangeObj:any;
  public latestNotification:string;

  constructor(
    private UserService:UserService,
    private SocketService:SocketService,
    //private TaskService:TaskService,
    private Utility:UtilityService,
    private router:Router   
  ){}

  ngOnInit(){
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    console.log(this.pageOwnerId);
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;
    this.userId=this.pageOwnerId;
    console.log(this.userId);
    this.fullName=this.pageOwnerName;

    this.sendUserDetails(this.pageOwnerId, this.userId, this.fullName, this.pageType);

    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getUserDetails();
    this.getContactList();
    this.showContactList();
    this.sendFriendList();
    this.getFriendList();
    this.getMessageFromAUser();
    this.getFriendRequestAcceptMessage();
    this.getSuccessMessage(); 
    this.getUndoSuccessMessage(); 
    this.getCurrentNotification();
    this.showAllNotifications();  
    this.getAllNotifications();
    this.keypressFunction(); 
         
  }
//------------------------------------------------------------------------------------------------
public checkStatus: any = () => {
  if (this.authToken === undefined || 
       this.authToken === '' || 
        this.authToken === null) {
        this.router.navigate(['/']);
         return false;
  } else {
    return true;
  }
} // end checkStatus

public verifyUserConfirmation():any{
  this.SocketService.verifyUser()
      .subscribe(
        (data)=>{
          //console.log(data);
          this.SocketService.setUser(this.authToken);
        }, (err)=>{
          //console.log(err);
        }
      )
}
//get list of online users
public getOnlineUserList=():any=>{
  this.SocketService.onlineUserList().subscribe(
    (data)=>{
      //console.log(data);
    }
  )
}

public sendFriendList(){
  let data={
    userId:this.pageOwnerId
  }
  this.SocketService.sendFriendList(data);
}

public getFriendRequestAcceptMessage(){
  this.SocketService.getFriendAcceptMessage().subscribe(
    data=>{
      if(this.pageOwnerId===data.receiverId || 
        this.pageOwnerId===data.senderId ){
          console.log(data);
        }         
    }
  ) 
}
 public sendUserDetails=(pageOwnerId, userId, fullName, pageType)=>{
   let data={
    pageOwnerId:pageOwnerId,
    userId:userId,
    fullName:fullName,
    pageType:pageType
  }
  //console.log(data);
  this.SocketService.sendUserDetails(data);
}

public getUserDetails(){
  this.SocketService.getUserDetails().subscribe(
    data=>{
      if(this.pageOwnerId===data.pageOwnerId){
        this.userId=data.userId;
        this.fullName=data.fullName; 
        this.pageType=data.pageType;
      }             
    }
  )   
}
 
public moveToHomePage(){
  let data={
    pageOwnerId:this.pageOwnerId,
    userId:this.pageOwnerId,
    fullName:this.pageOwnerName,
    pageType:"self"
  }
    
    this.SocketService.sendUserDetails(data);
 }
//-------------------------------Success Message for socket calls------------------------------  
  public getSuccessMessage():any{
    this.SocketService.getSuccessMessage().subscribe(
      data=>{
        console.log(data);  
        this.showAllNotifications();
      }, (error)=>{
        console.log(error);
      }
    )
  }  
  //-------------------------------------Undo Change------------------------------------------
  public undoLastChange(){    
    this.SocketService.undoLastChange(this.lastChangeObj);     
  }

  @HostListener('document:keydown.control.z') undoKeyboardEvent(event: KeyboardEvent) {
    //console.log("control and z key pressed" + KeyboardEvent);
    this.undoLastChange();
    // responds to control+z
  }
  
  
  
  public keypressFunction=() => { 
    $(document).keypress(function(e) {
      if(e.which === 90) {
        ////console.log("key pressed");
          this.undoLastChange();
      }
  });     
  }
  
  //-------------------------------Success Message for socket calls------------------------------  
  public getUndoSuccessMessage():any{
    this.SocketService.getUndoSuccessMessage().subscribe(
      data=>{
        ////console.log(data);  
        this.showAllNotifications();
      }, (error)=>{
        console.log(error);
      }
    )
  }  

  //------------------------------------Contacts----------------------------------------------
  public getContactList(){
    let data={
      pageOwnerId:this.pageOwnerId
    }
    this.SocketService.getContactList(data);    
  }  
  public showContactList(){
    ////console.log(this.pageOwnerId);
    this.SocketService.showContactList().subscribe(      
      apiResponse=>{
        ////console.log(apiResponse);
        if(apiResponse.pageOwnerId===this.pageOwnerId){
          this.userList=apiResponse.data;       
          ////console.log(this.userList); 
        }        
                             
      },
      error=>{
        ////console.log(error);
        this.router.navigate(['/error-page', error.error.message, error.error.status]);
      })       
  }

  public showContactModal(){    
    $("#contacts-modal").slideToggle(1500);
  }

  public closeContactsModal(){
    $("#contacts-modal").slideUp(1000);
  }
//-------------------------------------------------------------------------------------------
public sendFriendRequest=(id, fullName)=>{
  //console.log("Friend Request sent to "+ id + ": "+ fullName);
  this.friendRequest=true;
  let data={
    msgType:"friend-request",
    receiverId:id,
    receiverName:fullName,
    senderId:this.pageOwnerId,
    senderName:this.pageOwnerName
  }
  this.SocketService.sendFriendRequest(data); 
  $("#contacts-modal").slideUp(1500); 
}
//function - to get message from other user(for private message like friend request)
 public getMessageFromAUser :any =()=>{   
  this.SocketService.messageByUserId(this.pageOwnerId)
  .subscribe((data)=>{
    console.log(data);
    console.log(this.userId);
    this.message=data.message;
    this.receiverId=data.receiverId;
    this.receiverName=data.receiverName;
    this.senderId=data.senderId;
    this.senderName=data.senderName;
    if(this.receiverId===this.userId){
      console.log("matched userId");
      if(data.msgType==="friend-request"){
        this.friendRequest=true;
        $("#friendship-modal").fadeIn(2000);
      } else if(data.msgType==="notification"){
        console.log("matched notification");
        this.latestNotification=this.message;
        console.log(this.latestNotification)    
        $("#notification-modal").fadeIn(2000);
      }

    }
    
    
  });//end subscribe
}// end get message from a user 
//function - to accept friend request
public acceptFriendRequest=()=>{
  //console.log("friend request accepted");
  let data={
    receiverId:this.receiverId,
    receiverName:this.receiverName,
    senderId:this.senderId,
    senderName:this.senderName
  }
  this.SocketService.acceptFriendRequest(data);
  $("#friendship-modal").fadeOut(2000);
}
//function - to decline friend request
public declineFriendRequest=()=>{
  //console.log("friend request declined");
}
  //----------------------------------------------------------------------------------------
  //-------------------------------Notifications------------------------------------------
  
  public getCurrentNotification():any{
    this.SocketService.getCurrentNotification().subscribe(
      data=>{               
        this.sendCurrentNotificationToFriend(data.data.message);
        this.showAllNotifications();
        
      }, (error)=>{
        //console.log(error);
      }
    )
  }
  
  public showAllNotifications(){
    let data={
      userId:this.userId
    }
    this.SocketService.showAllNotifications(data);
    this.getAllNotifications();
  }
  
  public getAllNotifications():any{    
    this.SocketService.getAllNotifications().subscribe(
      data=>{ 
        if(data.status===200){
          this.notificationList=data.data;                   
          this.notificationList=this.Utility.arrangeListsByDescendingOrder(this.notificationList);
          this.lastChangeObj=this.notificationList[0];
          this.latestNotification=this.lastChangeObj.message; 
          //console.log(this.latestNotification);
        } else {
            this.notificationList=[];
            this.latestNotification="No new notification to display"
        }    
              
      }, (error)=>{
        ////console.log(error);
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )  
  }

  public getFriendList():any{
    this.SocketService.getFriendList().subscribe(
      apiResponse=>{
        //console.log(apiResponse);
       if(this.pageOwnerId===apiResponse.pageOwnerId){
          this.friendList=apiResponse.data;
          console.log(this.friendList);
        }
        
      },
      error=>{
        //console.log(error);            
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }
  public sendCurrentNotificationToFriend(message){
    console.log("inside send current notification function");
    console.log(this.friendList);
    for(let i=0; i<this.friendList.length; i++){
      console.log("inside loop "+i);
      let data={
        senderId:this.pageOwnerId,
        senderName:this.pageOwnerName,
        receiverId:this.friendList[i].friendId,
        receiverName:this.friendList[i].friendName,
        message:message,
        msgType:"notification"
      }
      console.log(data);  
      this.SocketService.sendMessageToFriend(data);
    }
    
  }
//--------------------------------------Modals----------------------------------------------
  public showNotificationsInModal(){    
    $("#all-notification-modal").slideToggle(1500); 
  }
  public closeNotificationModal(){
    $("#all-notification-modal").slideUp(1000);  
  }
  /*  
  public showCurrentNotifModal(message){
    this.latestNotification=message;    
    $("#notification-modal").fadeIn(2000);
  }
  */
  public closeCurrentNotifModal(){  
    $("#notification-modal").fadeOut(2000);
  }
  //-----------------------------------------------------------------------------------------------------


}