import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  /*
  public authToken:string;
  public userId:string; 
  public fullName:string;
  public notificationList:any=[];
  public latestNotification:string;
*/
  constructor(
    private SocketService:SocketService,
    private UserService:UserService,
    private Utility:UtilityService
  ) { }

  ngOnInit() {
    /*
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName; 
    this.SocketService.showAllNotifications({userId:this.userId});
    this.showAllNotifications();
    this.getAllNotifications();
    */
  }
/*
  public showAllNotifications(){
    let data={
      userId:this.userId
    }
    this.SocketService.showAllNotifications(data);
  }

  public getAllNotifications():any{
    console.log("getAllNotifications called");
    this.SocketService.getAllNotifications().subscribe(
      data=>{      
        this.notificationList=data.data;
        console.log(this.notificationList);
        this.notificationList=this.Utility.arrangeListsByDescendingOrder(this.notificationList);        
      }, (error)=>{
        console.log(error);
      }
    )  
  }
*/
}
