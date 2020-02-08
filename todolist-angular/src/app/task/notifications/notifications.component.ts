import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { UserService } from 'src/app/user.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public authToken:string;
  public userId:string; 
  public fullName:string;
  public notificationList:any=[];
  public latestNotification:string;

  constructor(
    private TaskService:TaskService,
    private UserService:UserService,
    private Utility:UtilityService
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName; 

    this.getAllNotifications();
  }

  public getAllNotifications():any{
    console.log("getAllNotifications called");
    this.TaskService.getAllNotifications(this.authToken).subscribe(
      data=>{      
        this.notificationList=data.data;
        console.log(this.notificationList);
        //this.notificationList=this.Utility.arrangeListsByDescendingOrder(this.notificationList);
        //this.latestNotification=this.notificationList[0].message;       
      }, (error)=>{
        console.log(error);
      }
    )  
  }

}
