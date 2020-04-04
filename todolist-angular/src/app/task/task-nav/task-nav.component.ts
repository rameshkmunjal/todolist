import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserService} from './../../user.service';
import {SocketService} from './../../socket.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-task-nav',
  templateUrl: './task-nav.component.html',
  styleUrls: ['./task-nav.component.css']
})
export class TaskNavComponent implements OnInit {
  @Input() userId:string;
  public authToken:string;  
  public pageOwnerName:string;
  public showList:boolean=false;
  public showNotif:boolean=false;
  

  constructor(
    private UserService:UserService,
    private SocketService:SocketService
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;    
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;        
  }

  public showContactList=()=>{

    if(this.showList===false){
      this.showList=true;
    } else {
      this.showList=false;
    }

    let data={
      userId:this.userId,
      showList:this.showList,
      event:'contact-list'
    }
    this.SocketService.showContactList(data);
  }
//-------------------------------------------------------------------------------
public showNotificationList=()=>{

  if(this.showNotif===false){
    this.showNotif=true;
  } else {
    this.showNotif=false;
  }

  let data={
    userId:this.userId,
    showNotif:this.showNotif,
    event:'notification-list'
  }
  this.SocketService.showNotificationList(data);
}
//-------------------------------------------------------------------------------  

}
