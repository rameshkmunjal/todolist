//import dependencies
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
  @Input() userId:string;
  public pageOwnerId:string;
  public pageOwnerName:string;
  public authToken:string; 
  public friendList:any=[];  
  
  constructor(
    private router:Router,
    private UserService:UserService,
    private SocketService:SocketService
  ) { }

  ngOnInit() {    
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;

    this.getHomePageLoad();    
    this.getFriendsUpdated();    
  }

  public getHomePageLoad=():any=>{
    this.SocketService.getHomePageLoad()
      .subscribe((data)=>{
        if(this.pageOwnerId===data.pageOwnerId){          
          this.getFriendList(this.authToken, this.pageOwnerId);                                        
        }
      }, (error)=>{
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      })
  }
//----------------------------------------------------------------------------------------------
  public getFriendsUpdated=():any=>{   
    this.SocketService.getFriendsUpdated()
    .subscribe((data)=>{      
      if(this.userId===data.userId || this.userId===data.friendId){ 
          this.getFriendList(this.authToken, this.userId); 
      }    
    });//end subscribe
  }// end get message from a user 
  
  public getFriendList(authToken, userId):any{    
    this.UserService.getFriendList(authToken, userId).subscribe(
      apiResponse=>{ 
        if(apiResponse.data !== null){
          this.friendList=apiResponse.data;                     
        }          
      },
      error=>{                  
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }

//------------------------------------------------------------------------------------
public moveToFriendPage(friendId, friendFullName){
  let data={ 
    pageOwnerId:this.pageOwnerId,   
    userId:friendId,
    fullName:friendFullName,
    pageType:'friend',
    event:'load-friend-page'
  }  
  this.SocketService.loadFriendPage(data);  
}
//--------------------------------------------------------------------------------------
}
