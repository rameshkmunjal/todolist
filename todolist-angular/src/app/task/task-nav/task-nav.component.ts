import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UserService} from './../../user.service';
import {SocketService} from './../../socket.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-task-nav',
  templateUrl: './task-nav.component.html',
  styleUrls: ['./task-nav.component.css']
})
export class TaskNavComponent implements OnInit {
  @Output() contactsRequested = new EventEmitter<string>();//
  @Output() bellClickEvent = new EventEmitter<string>();
  public authToken:string;
  public userId:string;
  public fullName:string;

  public notificationList:any=[];
  public latestNotification:string;
  

  constructor(
    private UserService:UserService,
    private SocketService:SocketService
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
        
  }

  


  

}
