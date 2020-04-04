//import angular packages
import { Component, OnInit, Input } from '@angular/core';
import { Router} from '@angular/router';
//import user denfined services
import {UserService} from './../../user.service';
import { SocketService } from './../../socket.service';
import { TaskService } from './../../task.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})

export class FriendListComponent implements OnInit {
  @Input() userId:string;
  public pageOwnerId:string;
  public pageOwnerName:string;
  public authToken:string; 
  public friendList:any=[];  
  
  constructor(
    private router:Router,
    private UserService:UserService,
    private SocketService:SocketService,
    private TaskService:TaskService

  ) { }

  ngOnInit() {
    //console.log(this.userId);
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;

    this.getHomePageLoad();    
    //this.updateListPageResponse();
    this.getContactsFriendsUpdated();    
  }

  public getHomePageLoad:any=()=>{
    this.SocketService.getHomePageLoad()
      .subscribe((data)=>{
        if(this.pageOwnerId===data.pageOwnerId){          
          this.getFriendList(this.authToken, this.pageOwnerId); 
          console.log(this.friendList);                               
        }
      }, (error)=>{
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      })
  }
//----------------------------------------------------------------------------------
/*
public updateListPageResponse:any=()=>{
  this.SocketService.updateListPageResponse()
    .subscribe((data)=>{      
      if(this.userId===data.userId ){         
        console.log(data);
        if(data.list !== null && data.subEvent==="show-notif"){
          this.createInputForNotification(data.list);
        }
        if(this.friendList.length > 0){
          let data={
            userId:this.userId,
            friendList:this.friendList
          }
          console.log(data);
          this.SocketService.latestChange(data);
        } 
      }             
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
*/
//----------------------------------------------------------------------------------------------
  public getContactsFriendsUpdated:any =()=>{   
    this.SocketService.getContactsFriendsUpdated()
    .subscribe((data)=>{ 
      //console.log(data);   
      
      if(this.userId===data.userId || this.userId===data.friendId){ 
          this.getFriendList(this.authToken, this.userId); 
      }    
    });//end subscribe
  }// end get message from a user 
  
  public getFriendList(authToken, userId):any{
    //console.log(userId);
    this.UserService.getFriendList(authToken, userId).subscribe(
      apiResponse=>{        
          this.friendList=apiResponse.data; 
          //console.log(this.friendList);
          if(this.friendList.length>0){
            let data={
              userId:this.userId,
              friendList:this.friendList
            }
            console.log(data);
            this.SocketService.latestChange(data);
          }
          
      },
      error=>{                  
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }

//------------------------------------------------------------------------------------
public moveToFriendPage(friendId, friendFullName){
  //console.log(friendId+" : "+friendFullName);
  let data={ 
    pageOwnerId:this.pageOwnerId,   
    userId:friendId,
    fullName:friendFullName,
    pageType:'friend',
    event:'load-friend-page'
  }
  //console.log(data);
  this.SocketService.loadFriendPage(data);  
}
//-------------------------------------------------------------------------------------- 
public createInputForNotification(data){
  console.log("SendInputForNotifications" + JSON.stringify(data));
  let message="";
  let happened="";
  let fullName="";
  ////console.log(this.fullName);
  if(data.action=="create"){
    happened="created";
    fullName=data.createdBy;
    message=`${data.type}  "${data.listName}" is ${happened}  by  ${fullName}`; 
  } else if(data.action=="edit"){
    happened="edited";
    fullName=data.changeBy;
    message=`${data.type}  "${data.listName}" is ${happened}  by  ${data.changeBy}`;
  } else if(data.action=="delete"){
    happened="deleted";
    fullName=data.changeBy;
    message=`${data.type} "${data.listName}" is ${happened}  by  ${data.changeBy}`;
  }else{
    happened = "changed";
    fullName=data.changeBy;
    message=`${data.type}  "${data.listName}"status  ${happened}   by  ${data.changeBy}`;
  }  
  let temp={
    type:data.type,
    action:data.action,
    typeId:data.listId,
    originId:data.originId,
    message:message,
    sendId:this.pageOwnerId,
    sendName:this.pageOwnerName
  }
  console.log(temp);
  this.TaskService.createNotification(this.authToken, this.userId, temp).subscribe(
    apiResponse=>{
      console.log(apiResponse.data);      
      let data={
        event:'publish-notification',
        notification:apiResponse.data.message,
        friendList:this.friendList
      }
      this.SocketService.publishNotification(data);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//--------------------------------------------------------------------------------------
}
