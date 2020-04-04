//import angular packages
import { Component, OnInit, Input } from '@angular/core';
import { Router} from '@angular/router';

// import user denfined services
import { UserService } from 'src/app/user.service';
import { TaskService } from 'src/app/task.service';
import { SocketService } from './../../socket.service';
import { UtilityService} from './../../utility.service';
//import jquery
import * as $ from 'jquery';

@Component({
  selector: 'app-list',  
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit { 
  @Input() userId:string;
   //will hold value pageOwnerId or friendId - as will be page
  public pageOwnerId:string;
  public pageOwnerName:string;
  public authToken:string;
 
  public fullName:string;
  public allLists:any=[];
  public listId:string;
  public listName:string;
  public pageType:string="self";

  public newList:string;
  

  constructor(
    private UserService:UserService,        
    private SocketService:SocketService,
    private Utility:UtilityService,
    private TaskService:TaskService,
    private router:Router
    
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.pageOwnerId=this.UserService.getUserFromLocalStorage().userId;
    this.pageOwnerName=this.UserService.getUserFromLocalStorage().fullName;

    this.getHomePageLoad();
    this.getFriendPageLoad();
    this.updateListPageResponse();
    this.undoResponse();    
  }
  //-------------------------------------------------------------------------------------------
  
  public getHomePageLoad:any=()=>{
    this.SocketService.getHomePageLoad()
      .subscribe((data)=>{
        if(this.pageOwnerId===data.pageOwnerId){
          this.userId=data.userId;
          this.fullName=data.fullName;
          this.pageType=data.pageType;
          this.getAllListsOfAUser(this.authToken, this.pageOwnerId);
        } 
      }, (error)=>{
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      })
  }
  //-----------------------------------------------------------------------------------------
public getFriendPageLoad:any=()=>{
  this.SocketService.getFriendPageLoad()
    .subscribe((data)=>{
      if(this.pageOwnerId===data.pageOwnerId){
        this.userId=data.userId;
        this.fullName=data.fullName;
        this.pageType=data.pageType;
        console.log(data); 
        console.log(this.userId); 
        this.getAllListsOfAUser(this.authToken, data.userId);
      }
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//----------------------------------------------------------------------------------
public updateListPageResponse:any=()=>{
  this.SocketService.updateListPageResponse()
    .subscribe((data)=>{      
      if(this.userId===data.userId){            
        this.getAllListsOfAUser(this.authToken, this.userId);                   
      }      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//----------------------------------------------------------------------------------------------
public changeStatus(listId){
  let data={    
    listId:listId,
    type:"list",
    action:"change-status",
    userId:this.pageOwnerId,
    changeName:this.pageOwnerName
  }
  this.TaskService.changeListStatus(this.authToken, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        userId:this.userId,
        //event:'update-list',
        //subEvent:'show-notif', 
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
      
    }, (error)=>{
      console.log(error);
    }
  )
}
//------------------------------------------------------------------------------
public getAllListsOfAUser(authToken, userId){
  this.TaskService.getAllListsOfAUser(authToken, userId).subscribe(
    apiResponse=>{
      if(apiResponse.status===200){
        //console.log(apiResponse);
        this.allLists=apiResponse.data;
        this.Utility.arrangeListsByDescendingOrder(this.allLists);
      } else {
        this.allLists=[];
      }
      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message])
    }
  )
}
//---------------------------------------------------------------------------------
//function - create list - involving DB operations
public createList=()=>{
  //console.log(this.newList);
  let data={
    listName:this.newList,    
    creatorId:this.userId,
    createdBy:this.pageOwnerName,
    type:"list"
  }
  //console.log(data);
  this.sendInputToCreateList(this.authToken, this.pageOwnerId, data);  
}
//function - when enter key is pressed - create list
public createListUsingKeypress: any = (event: any) => {
  if (event.keyCode === 13) { // 13 is keycode of enter.
    this.createList();
  }
} 

public sendInputToCreateList(authToken, userId, data){
  this.TaskService.createList(authToken, userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse.data);       

      let data={
        userId:this.userId,
        //event:'update-list',
        //subEvent:'show-notif', 
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
  
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )  
  this.newList="";

} 
//------------------------------------------------------------------------------------------------
public editList(){  
  $("#editListModal").hide(2000); 
  let data={
    listId:this.listId,
    listName:this.listName,      
    changeId:this.pageOwnerId,
    changeName:this.pageOwnerName,
    type:"list",
    action:"edit"     
  } 
  this.TaskService.editList(this.authToken, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      
      let data={
        userId:this.userId,
        //event:'update-list',
        //subEvent:'show-notif',
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )        
}

public showEditListModal(listId, listName){  
  this.listId=listId;
  this.listName=listName;
  $("#editListModal").show();
}

public closeEditModal(){
  $("#editListModal").hide(2000); 
}  
//--------------------------------------------------------------------------------------------------------
//function - to delete list
public deleteList(id){ 
  let data={
    listId:id,
    changeBy:this.pageOwnerName,
    changeId:this.pageOwnerId,
    type:"list",
    action:"delete"
  }   
  this.TaskService.deleteList(this.authToken,  data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        userId:this.userId,
        //event:'update-list',
        //subEvent:'show-notif',
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )   
}

//-------------------------------------------------------------------------------

public undoResponse(){
  this.SocketService.undoResponse().subscribe(
    data=>{
      //console.log(data);
      if(data.userId===this.pageOwnerId && data.type==="list"){
        console.log(data);
        if(data.action==="create"){
          this.undoCreateList(data);
        } else if(data.action==="delete"){
          this.undoDeleteList(data);
        }        
      }    
    }
  )
}

public undoCreateList(data){
  console.log(data);
  this.TaskService.undoCreateList(this.authToken, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        userId:apiResponse.data.creatorId,
        //event:'update-list', 
        //subEvent:'no-notif',
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      console.log(error);
    }
  )
}

public undoDeleteList(data){
  console.log(data);
  this.TaskService.undoDeleteList(this.authToken, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        userId:apiResponse.data.creatorId,
        //event:'update-list', 
        //subEvent:'no-notif',
        //list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      console.log(error);
    }
  )
}
//---------------------------------------------------------------------
//end of class definition
}




//-----------------------------------------------------------------------
