import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import * as $ from 'jquery';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public authToken:string;
  public userId:string; 
  public fullName:string;
  public userList:any=[];
  public actionWord:string;
  
  public notificationList:any=[];
  public latestNotification:string;

  constructor(
    private UserService:UserService,
    private SocketService:SocketService,
    private TaskService:TaskService,
    private router:Router   
  ){}

  ngOnInit(){
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName; 
    this.getFriendList();
    //this.getNotificationArray();
    this.getCurrentNotification();  
    this.getAllNotifications();        
  }

 public moveToHomePage(){
    let data={
      userId:this.userId,
      fullName:this.fullName
    }
    console.log(data);
    this.SocketService.sendFriendDetails(data);
 }
//------------------------------------------------------------------------ 



//-----------------------------------------------------------------------------------------


  //-------------------------------Notifications------------------------------------------
  public getCurrentNotification():any{
    this.SocketService.getCurrentNotification().subscribe(
      data=>{
        console.log(data);
        this.showCurrentNotifModal(data.data.message);
        this.getAllNotifications();
      }, (error)=>{
        console.log(error);
      }
    )
  }
  
  public getAllNotifications():any{
    console.log("getAllNotifications called");
    this.TaskService.getAllNotifications(this.authToken).subscribe(
      data=>{      
        this.notificationList=data.data;
        console.log(this.notificationList); 
        this.latestNotification=this.notificationList[this.notificationList.length-1].message;       
      }, (error)=>{
        console.log(error);
      }
    )  
  }
  //----------------------------------------------------------------------------------------
  public showCurrentNotifModal(message){
    this.latestNotification=message;
    $("#notification-modal").show(2000);
  }
  public closeCurrentNotifModal(){  
    $("#notification-modal").hide(2000);
  }
  //----------------------------------------------------------------------------------------
  public undoLatestChange(){
    console.log("you clicked notification bell");  
  }
  //----------------------------------------------------------------------------------------  
  public showContactList(){
    this.UserService.getNonFriendContacts(this.authToken, this.userId).subscribe(
      apiResponse=>{
        console.log(apiResponse);
        this.userList=apiResponse.data;       
        console.log(this.userList);
        $("#contacts-modal").show();              
      },
      error=>{
        console.log(error);
        this.router.navigate(['/error-page', error.error.message, error.error.status]);
      })       
  }

  public closeContactsModal(){
    $("#contacts-modal").hide();
  }
//-------------------------------------------------------------------------------------------
  public getFriendList(){
    this.SocketService.getFriendList().subscribe(
      apiResponse=>{
        console.log(apiResponse);
      }, (err)=>{
        console.log(err);
      }
    )
  }
  
  public showAllNotifications(){
    console.log(this.notificationList);
    console.log("all notifications will be shown ");
    $("#all-notification-modal").slideToggle(2000); 
  }
  public closeNotificationModal(){
    $("#all-notification-modal").slideUp(2000);  
  }
  //-----------------------------------------------------------------------------------------------------


}