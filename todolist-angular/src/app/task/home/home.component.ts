import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import * as $ from 'jquery';
import { TaskService } from 'src/app/task.service';
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

  public pageType="own";

  public message:string;

  public friendId:string;
  public friendName:string;

  public receiverId:string;
  public receiverName:string;
  public senderId:string;
  public senderName:string;

  public userList:any=[];
  public actionWord:string;
  
  public notificationList:any=[];
  public lastChangeObj:any;
  public latestNotification:string;

  constructor(
    private UserService:UserService,
    private SocketService:SocketService,
    private TaskService:TaskService,
    private Utility:UtilityService,
    private router:Router   
  ){}

  ngOnInit(){
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    console.log(this.pageOwnerId);
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;
    this.userId=this.pageOwnerId;
    this.fullName=this.pageOwnerName;

    //this.sendUserDetails(this.userId, this.fullName);
    ///this.getFriendList();
    this.getMessageFromAUser();
    this.getSuccessMessage();  
    this.getCurrentNotification();  
    this.getAllNotifications(); 
         
  }
//-------------------------------------------------------------------------------------------- 
 public sendUserDetails=(userId, fullName)=>{
   let data={
    userId:userId,
    fullName:fullName
  }
  //console.log(data);
  this.SocketService.sendUserDetails(data);
}
 
public moveToHomePage(){
  let data={
    userId:this.pageOwnerId,
    fullName:this.pageOwnerName,
    pageType:"own"
  }
    //console.log(data);
    this.SocketService.sendUserDetails(data);
 }
//-------------------------------Success Message for socket calls------------------------------  
  public getSuccessMessage():any{
    this.SocketService.getSuccessMessage().subscribe(
      data=>{
        console.log(data);  
        this.getAllNotifications();
      }, (error)=>{
        console.log(error);
      }
    )
  }  
  //-------------------------------------Undo Change------------------------------------------
  public undoLastChange(){
    //console.log("you clicked undoLastChange"); 
    //console.log(this.lastChangeObj);
    this.SocketService.undoLastChange(this.lastChangeObj);
     
  }
  //------------------------------------Contacts----------------------------------------------  
  public showContactList(){
    console.log(this.pageOwnerId);
    this.UserService.getNonFriendContacts(this.authToken, this.pageOwnerId).subscribe(
      apiResponse=>{
        //console.log(apiResponse);
        this.userList=apiResponse.data;       
        console.log(this.userList);
        $("#contacts-modal").slideToggle(1500);              
      },
      error=>{
        //console.log(error);
        this.router.navigate(['/error-page', error.error.message, error.error.status]);
      })       
  }

  public closeContactsModal(){
    $("#contacts-modal").slideUp(1000);
  }
//-------------------------------------------------------------------------------------------
public sendFriendRequest=(id, fullName)=>{
  console.log("Friend Request send to "+ id + ": "+ fullName);
  let data={
    receiverId:id,
    receiverName:fullName,
    senderId:this.pageOwnerId,
    senderName:this.pageOwnerName
  }
  this.SocketService.sendFriendRequest(data);  
}
//function - to get message from other user(for private message like friend request)
 public getMessageFromAUser :any =()=>{
  this.SocketService.messageByUserId(this.pageOwnerId)
  .subscribe((data)=>{
    //console.log(data);
    this.message=data.message;
    this.receiverId=data.receiverId;
    this.receiverName=data.receiverName;
    this.senderId=data.senderId;
    this.senderName=data.senderName;
    $("#friendship-modal").fadeIn(2000);
  });//end subscribe
}// end get message from a user 
//function - to accept friend request
public acceptFriendRequest=()=>{
  console.log("friend request accepted");
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
  console.log("friend request declined");
}
  //----------------------------------------------------------------------------------------
  //-------------------------------Notifications------------------------------------------
  public getCurrentNotification():any{
    this.SocketService.getCurrentNotification().subscribe(
      data=>{
        //console.log(data);        
        this.showCurrentNotifModal(data.data.message);
        this.getAllNotifications();
      }, (error)=>{
        console.log(error);
      }
    )
  }
  
  public getAllNotifications():any{
    //console.log("getAllNotifications  called");
    this.TaskService.getAllNotifications(this.authToken).subscribe(
      data=>{ 
        if(data.status===200){
          this.notificationList=data.data;          
          //this.notificationList=this.Utility.arrangeListsByDescendingOrder(this.notificationList);
          this.lastChangeObj=this.notificationList[this.notificationList.length-1];
          this.latestNotification=this.lastChangeObj.message; 
          console.log(this.latestNotification);
        } else {
            this.notificationList=[];
            this.latestNotification="No new notification to display"
        }    
              
      }, (error)=>{
        //console.log(error);
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )  
  }
//--------------------------------------Modals----------------------------------------------
  public showAllNotifications(){
    //console.log(this.notificationList);
    //console.log("all notifications will be shown ");
    $("#all-notification-modal").slideToggle(1500); 
  }
  public closeNotificationModal(){
    $("#all-notification-modal").slideUp(1000);  
  }  
  public showCurrentNotifModal(message){
    this.latestNotification=message;
    $("#notification-modal").fadeIn(2000);
  }
  public closeCurrentNotifModal(){  
    $("#notification-modal").fadeOut(2000);
  }
  //-----------------------------------------------------------------------------------------------------


}