//import angular packages
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from 'src/app/user.service';
//import user denfined services
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
  public authToken:string;
  public userList:any=[];
  public pageOwnerId:string;
  public userId:string;
  public userName:string;
  public fullName:string;

  public errorMessage:string;
  public msgObj:any;

  public allLists:any=[];
  public newList:string;
  public listName:string;
  public listTitle:string;
  public listId:string;
  public items:any=[];
  public subItems:any=[];

  constructor(
    private UserService:UserService,        
    private SocketService:SocketService,
    private Utility:UtilityService,
    private router:Router
    
  ) { }

  ngOnInit() {
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.pageOwnerId=this.userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;    
    
    this.getFriendDetails();  
    this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
    this.getAllListsMessage();
    this.getCreateListMessage() ;
    this.getEditListMessage();
    this.getDeleteListMessage();
    //this.getChangeStatus(); 
  }
//------------------------------------function definitions------------------------------------------------
//function - create list - involving DB operations
public createList=()=>{
  console.log(this.newList);
  let data={
    listName:this.newList,
    creatorId:this.userId,
    createdBy:this.fullName
  }
  console.log(data);
  this.SocketService.createList(data);  
  this.newList="";
}
//function - when enter key is pressed - create list
public createListUsingKeypress: any = (event: any) => {
  if (event.keyCode === 13) { // 13 is keycode of enter.
    this.createList();
  }
} 
//-----------------------------------------------------------------------------------------------
//function - to edit list
public editList(listId){
  console.log(listId);
  $("#editListModal").hide(2000);
  this.listId=listId;
  console.log(this.listId);
  console.log(this.listName);
  
  let data={
    listId:listId,
    listName:this.listName,      
    changeId:this.userId,
    changeName:this.fullName      
  }
  //console.log(data);
  this.SocketService.editList(data);        
}
//-------------------------------------------------------------------------------------------------------
//function - to delete list
public deleteList(id){
  let data={
    userId:this.userId,      
    listId:id
  }
  console.log(data);
  this.SocketService.deleteList(data);  
  this.SocketService.getItemsByListId(data);
}
//--------------------------------------------------------------------------------------
//function - to get items using list id
public getItemsByListId(listId, userId, listName){ 
  let d={
    listId:listId,
    listName:listName,
    userId:userId
  }
  this.SocketService.sendListDetailsToItemBox(d);
     
  let data={
    listId:listId,
    userId:userId,
    listName:listName
  }
  console.log(data);
  this.SocketService.getItemsByListId(data);
}
//--------------------------functions to get messages through socket listeners-------------------------------------------
public getAllListsMessage():any{
    console.log("home component :: getAllListsMessage called");
    this.SocketService.getAllListsMessage().subscribe(
      data=>{
        if(data.status===200){
          console.log(data);
          this.allLists=data.data;
          console.log(this.allLists);
          this.allLists=this.Utility.arrangeListsByDescendingOrder(this.allLists);
          console.log(this.allLists);
          this.errorMessage="";
          this.listName="";
        } else {
          console.log(data);
          if(data.status===404){
            this.allLists=[];
          } else{
            this.router.navigate(['/error-page', data.status, data.message]);
          }          
        }        
      },
      error=>{
        console.log(error);            
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
        this.allLists=[];
      }
    )
  }  
//--------------------------------------------------------------------------------------------------
//function - to get result of successful event of create list  
public getCreateListMessage(){
    this.SocketService.getCreateListMessage().subscribe(
      data=>{
        console.log(data);
        this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
        this.msgObj=data.data;        
        console.log(this.msgObj);
        this.sendInputForNotification(this.msgObj, "create", "created");
        //this.SocketService.sendAllNotifications();
      })
}  
//-----------------------------------------------------------------------------------------------------
//function - to get result of successful event of edit list
public getEditListMessage():any{
    console.log("getEditListMessage called");
    this.SocketService.getEditListMessage().subscribe(
      apiResponse=>{
        if(apiResponse.status===200){
          console.log(apiResponse);
          this.msgObj=apiResponse.data;        
          console.log(this.msgObj); 
          this.sendInputForNotification(this.msgObj, "edit", "edited");
          this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
        } else {
          console.log(apiResponse);
          this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
        }
      }, (err)=>{
          console.log(err);            
          this.router.navigate(['/error-page', err.error.status, err.error.message]);                   
      }
    )
  }
  //------------------------------------------------------------------------------------------------
  //function - to get result of successful event of delete list
  public getDeleteListMessage():any{
    console.log("getDeleteMessage called");
    this.SocketService.getDeleteListMessage().subscribe(
      apiResponse=>{
        console.log(apiResponse);
        if(apiResponse.status===200){
          this.msgObj=apiResponse.data;
          this.sendInputForNotification(this.msgObj, "delete", "deleted");
          this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
        } else {
          console.log(apiResponse);
          this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
        }
        }, (err)=>{
          console.log(err);            
          this.router.navigate(['/error-page', err.error.status, err.error.message]);        
      })
  }
  //-------------------------------------------------------------------------------------------
  //function - to get result of successful event of get friend details
  public getFriendDetails(){
    this.SocketService.getFriendDetails().subscribe(
      data=>{
        this.userId=data.userId;
        this.fullName=data.fullName;
        console.log(this.userId+" : "+this.fullName);
        this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
      }
    )   
  }
  //-------------------------------functions - relating modal-----------------------------------------  
  public showEditListModal(listId, listName){
    console.log(listId);
    console.log(listName);
    this.listId=listId;
    this.listName=listName;
    $("#editListModal").show();
  }

  public closeEditModal(){
    $("#editListModal").hide(2000); 
  }   
  //------------------------------------------------------------------------------
public sendInputForNotification(data,action, happened){
  let temp={
    type:"list",
    action:action,
    typeId:data.originId,
    message:"List "+data.listName+" is "+ happened + " by " +this.fullName,
    sendId:this.userId,
    sendName:this.fullName
  }
  this.SocketService.sendCurrentNotification(temp);
}
//--------------------------------------------------------------------------------------
/*
public getChangeStatus(){
  this.SocketService.getChangeStatus().subscribe(
    apiResponse=>{
      console.log(apiResponse);
    }, (error)=>{
      console.log(error);
    }
  )
}


public changeStatus(originId){
  console.log(originId);
  let data={
    type:"list",
    originId:originId
  }
  this.SocketService.changeStatus(data);
}
*/
//------------------------------------------------------
//end of class definition
}
