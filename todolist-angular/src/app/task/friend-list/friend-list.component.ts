//import angular packages
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
//import user denfined services
import {UserService} from './../../user.service';
import { SocketService } from './../../socket.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})

export class FriendListComponent implements OnInit {  
  public authToken:string;
 
  public userId:string;
  public fullName:string;
  public friendList:any=[];  

  constructor(
    private router:Router,
    private UserService:UserService,
    private SocketService:SocketService
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.getFriendList(this.authToken, this.userId);   
  }
    

  public getFriendList(authToken, userId):any{
    this.UserService.getFriendList(authToken, userId).subscribe(
      apiResponse=>{
        console.log(apiResponse);
        this.friendList=apiResponse.data;
        console.log(this.friendList);
      },
      error=>{
        console.log(error);            
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }
//---------------------------------------------------------------------------------
public moveToFriendPage(friendId, friendFullName){
  let data={
    userId:friendId,
    fullName:friendFullName,
    pageType:"friend"
  }
  this.SocketService.sendUserDetails(data);
}
//--------------------------------------------------------------------------------------  


}
