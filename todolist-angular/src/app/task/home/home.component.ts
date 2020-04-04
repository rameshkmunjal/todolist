import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import {TaskService} from './../../task.service';
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

  public pageOwnerId:string;
  public pageOwnerName:string;
  public contactList:any=[];
  public notificationList:any=[];

  public userId:string; 
  public fullName:string;

  public senderId:string;
  public senderName:string;
  public message:string;
  public friendRequest=false;

  public latestNotification="";
  public lastChangeMessage="";
  public lastChangeObject:any;
  

  constructor(
    private UserService:UserService,
    private SocketService:SocketService,
    private TaskService:TaskService,    
    private router:Router   
  ){}

  ngOnInit(){
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    //console.log(this.pageOwnerId);
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;
    this.userId=this.pageOwnerId;
    //console.log(this.userId);
    this.fullName=this.pageOwnerName;
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.loadHomePage();
    this.getHomePageLoad();
    this.getFriendPageLoad();
    this.getContactListResponse();
    this.getNotificationListResponse();
    //this.getFriendRequestResponse();
    this.acceptFriendRequestResponse();

    //this.getMessageFromAUser();
    this.getFriendRequest(); 
    this.getContactsFriendsUpdated();
    this.getPublishNotification();
    this.getLastChangeObject();
    //this.updateListPageResponse();
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
          console.log(data);
          this.SocketService.setUser(this.authToken);
        }, (err)=>{
          console.log(err);
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
//------------------------------------------------------------------------------------------
public loadHomePage=():any=>{
  let data={
    pageOwnerId:this.pageOwnerId,
    userId:this.userId,    
    fullName:this.pageOwnerName,
    pageType:'self',
    event:'load-home-page'
  }
  //console.log(data);
  this.SocketService.loadHomePage(data);
}

public getHomePageLoad:any=()=>{
  this.SocketService.getHomePageLoad()
    .subscribe((data)=>{
      if(this.pageOwnerId===data.pageOwnerId){ 
        console.log(data);        
        this.getContactList(this.authToken, this.userId);
        this.getNotificationList(this.authToken, this.userId);        
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//-------------------------------------Friend Related Events and Handlers----------------------------------------------------
public getFriendPageLoad:any=()=>{
  this.SocketService.getFriendPageLoad()
    .subscribe((data)=>{
      if(this.pageOwnerId===data.pageOwnerId){ 
        this.userId=data.userId;
        this.fullName=data.fullName;
        console.log(this.userId + " : "+this.fullName); 
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}

public acceptFriendRequestResponse:any=()=>{
  this.SocketService.acceptFriendRequestResponse()
    .subscribe((data)=>{
      if(this.userId===data.userId){
        //console.log("friend request accepted");
        this.message=data.message;
        $("#friendship-modal").fadeIn(2000).delay(5000).fadeOut(2000);
        //console.log(data);
        this.includeAContactInFriendList(data);
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}

public sendFriendRequest=(id, firstName, lastName)=>{ 
  $("#contacts-modal").slideUp(1000);
  let fullName=firstName+" "+lastName; 
  let data={
    senderId:this.userId,
    senderName:this.pageOwnerName,
    receiverId:id,
    receiverName:fullName,
    event:"friend-request",
    message:this.pageOwnerName+" has sent you a friend request"
  }
  //console.log(data);
  this.SocketService.sendFriendRequest(data);   
}

public getFriendRequest=()=>{
  this.SocketService.getFriendRequest().subscribe(
    data=>{
      //console.log(data);
      if(this.userId===data.receiverId){
        console.log("friend request");
        this.friendRequest=true;
        this.senderId=data.senderId;
        this.senderName=data.senderName;
        this.message=data.message;
        $("#friendship-modal").fadeIn(2000);
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

public acceptFriendRequest=(senderId, senderName)=>{
  $("#friendship-modal").fadeOut(2000);
  let data={
    userId:senderId,
    senderId:this.userId,
    senderName:this.pageOwnerName,
    receiverId:senderId,
    receiverName:senderName,
    message:this.pageOwnerName+" has accepted your friend request",
    event:'accept-request'
  }
  this.SocketService.acceptFriendRequest(data);
}

public declineFriendRequest:any=()=>{
  $("#friendship-modal").fadeOut(2000);
}
//-------------------Contact Related functions , event emitters and handlers-------------------------------

public getContactListResponse:any=()=>{
  this.SocketService.getContactListResponse()
    .subscribe((data)=>{
      if(this.userId===data.userId){ 
        if(data.showList){
          this.showContactModal();
        } else {
          this.closeContactModal();
        } 
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}

public getContactList(authToken, userId){
  this.UserService.getContactList(authToken, userId).subscribe(
    apiResponse=>{
      this.contactList=apiResponse.data;
      // console.log(this.contactList);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

public showContactModal(){    
  $("#contacts-modal").slideDown(1500);
}

public closeContactModal(){
  $("#contacts-modal").slideUp(1000);
}

public includeAContactInFriendList(data){
  let userData={
    userId:data.receiverId,
    userName:data.receiverName,
    friendId:data.senderId,
    friendName:data.senderName
  }
  this.UserService.includeAContactInFriendList(this.authToken, this.userId, userData)
    .subscribe(
      apiResponse=>{
        console.log(apiResponse.data);
        this.SocketService.updateContactAndFriendList(userData);
      }, (error)=>{
        //console.log(error);
        //this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
}
public getContactsFriendsUpdated:any =()=>{   
  this.SocketService.getContactsFriendsUpdated()
  .subscribe((data)=>{ 
    //console.log(data);   
    
    if(this.userId===data.userId || this.userId===data.friendId){ 
        this.getContactList(this.authToken, this.userId); 
    }    
  });//end subscribe
}// end get message from a user 

//-----------------------------------------------------------------------------------------------


//---------------------------Notification Related functions , event emitters and handlers---------------------
public getNotificationList(authToken, userId){
  this.TaskService.getNotificationList(authToken, userId).subscribe(
    apiResponse=>{
      this.notificationList=apiResponse.data;
      //console.log(this.notificationList);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}


public getNotificationListResponse:any=()=>{
  this.SocketService.getNotificationListResponse()
    .subscribe((data)=>{
      if(this.userId===data.userId){
        if(data.showNotif){
          this.showNotificationModal();
        } else {
          this.closeNotificationModal();
        } 
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}

public showNotificationModal(){    
  $("#all-notification-modal").slideToggle(1500); 
}
public closeNotificationModal(){
  $("#all-notification-modal").slideUp(1000);  
}
//-------------------------------Current Notification------------------------------------------
public getPublishNotification(){
  this.SocketService.getPublishNotification().subscribe(
    data=>{
      //console.log(data);      
         if(this.pageOwnerId===data.userId){
           this.latestNotification=data.notification;                     
           $("#notification-modal").fadeIn(2000);            
         }
    }
  )
}

public closeCurrentNotifModal(){
  $("#notification-modal").fadeOut(1000);  
}
//-----------------------------------------------------------------------------------------------
/*
public getMessageFromAUser:any=()=>{   
  this.SocketService.messageByUserId(this.userId)
  .subscribe((data)=>{ 
    
       if(data.event==="notification-list"){
        if(this.userId===data.userId){
          if(data.showNotif){
            this.showNotificationModal();
          } else {
            this.closeNotificationModal();
          } 
        }                     
      }                     
   });//end subscribe
}// end get message from a user 
*/
//-------------------------------------------------------------------------------------------------------
public getLastChangeObject(){
  this.SocketService.getLastChangeObject().subscribe(
    data=>{
      
      if(data.userId===this.userId && data.data !== null){
        console.log(data);
        this.lastChangeMessage=data.data.message;
        this.lastChangeObject=data.data;
        console.log(this.lastChangeMessage);
      }      
    }, (error)=>{
      console.log(error);
    }
  )
}
//-------------------------------------------------------------------------------
public undoLastChange(){
  console.log(this.lastChangeObject);  
  let data={
    userId:this.userId,
    notificationId:this.lastChangeObject.id,
    type:this.lastChangeObject.type,
    action:this.lastChangeObject.action,
    id:this.lastChangeObject.typeId
  }
  console.log(data);
  this.SocketService.undoLastAction(data);  
}
//-----------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------
public moveToHomePage(){
  this.loadHomePage();
}
//-------------------------------------------------------------------------------------
/*
public updateListPageResponse:any=()=>{
  this.SocketService.updateListPageResponse()
    .subscribe((data)=>{      
      if(this.userId===data.userId){         
          this.getLastChangeObject();   
      }  
             
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
*/
//--------------------------------------------------------------------------------------
}
//--------------------------------------------------------------------------------------
