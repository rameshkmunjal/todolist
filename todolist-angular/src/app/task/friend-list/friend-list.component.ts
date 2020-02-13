//import angular packages
import { Component, OnInit, Input } from '@angular/core';
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
  @Input() pageOwnerId:string;  
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
    //this.sendFriendList(); 
    this.getFriendList(); 
  }
    
  

  public getFriendList():any{
    this.SocketService.getFriendList().subscribe(
      apiResponse=>{
        ////console.log(apiResponse);
       if(this.pageOwnerId===apiResponse.pageOwnerId){
          this.friendList=apiResponse.data;
          ////console.log(this.friendList);
        }
        
      },
      error=>{
        //console.log(error);            
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }

  public getFriendRequestAcceptMessage(){
    this.SocketService.getFriendAcceptMessage().subscribe(
      data=>{
        if(this.pageOwnerId===data.receiverId || 
          this.pageOwnerId===data.senderId ){
            //console.log(data);
            this.sendFriendList();
            this.getFriendList();
          }         
      }
    ) 
  }

  public sendFriendList(){
    let data={
      userId:this.pageOwnerId
    }
    this.SocketService.sendFriendList(data);
  }
//------------------------------------------------------------------------------------
public moveToFriendPage(friendId, friendFullName){
  let data={
    pageOwnerId:this.userId,
    userId:friendId,
    fullName:friendFullName,
    pageType:"friend"
  }
  this.SocketService.sendUserDetails(data);
}
//--------------------------------------------------------------------------------------  


}
