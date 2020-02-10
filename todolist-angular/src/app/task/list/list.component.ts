//import angular packages
import { Component, OnInit, Input } from '@angular/core';
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
  @Input() pageOwnerId:string;
  public userList:any=[];
  
  public userId:string;
  public userName:string;
  public fullName:string;

  public pageType:string="self";

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
    
    this.getUserDetails();     
    this.getAllListsMessage();    
    this.getChangeStatus();
    this.getSuccessMessage(); 
    this.getUndoSuccessMessage();
  }
  //-------------------------------------------------------------------------------------------
  //function - user details send by home page
  public getUserDetails(){
    this.SocketService.getUserDetails().subscribe(
      data=>{
        console.log(data);
        if(this.pageOwnerId===data.pageOwnerId){
          this.userId=data.userId;
          this.fullName=data.fullName; 
          this.pageType=data.pageType;
          console.log(this.userId, this.fullName, this.pageType);
          this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
        }             
      }
    )   
  } 
  
//------------------------------------function definitions------------------------------------------------
//function - create list - involving DB operations
public createList=()=>{
  //console.log(this.newList);
  let data={
    listName:this.newList,
    creatorId:this.userId,
    createdBy:this.fullName,
    type:"list"
  }
  //console.log(data);
  this.SocketService.createTask(data);  
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
  //console.log(listId);
  $("#editListModal").hide(2000);
  this.listId=listId;  
  
  let data={
    listId:listId,
    listName:this.listName,      
    changeId:this.userId,
    changeName:this.fullName,
    type:"list",
    action:"edit"     
  }
  //console.log(data);
  this.SocketService.editTask(data);        
}
//-------------------------------------------------------------------------------------------------------
//function - to delete list
public deleteList(id){
  let data={
    userId:this.userId,      
    listId:id,
    type:"list"
  }
  
  this.SocketService.deleteTask(data);  
  this.SocketService.getItemsByListId(data);
}
//---------------------------------------------------------------------------------------
//function - to get items using list id
public getItemsByListId(listId, userId, listName){ 
  let d={
    pageOwnerId:this.pageOwnerId,
    listId:listId,
    listName:listName,
    userId:userId,
    fullName:this.fullName
  }
  console.log(d);
  this.SocketService.sendListDetailsToItemBox(d);
     
  let data={
    listId:listId,
    listName:listName,
    userId:this.userId
  }
  //console.log(data);
  this.SocketService.getItemsByListId(data);
}
//--------------------------functions to get messages through socket listeners-------------------------------------------
public getAllListsMessage():any{    
    this.SocketService.getAllListsMessage().subscribe(
      data=>{
        if(data.status===200 ){
          if(data.socketLoginId===this.userId){
            this.allLists=data.data;           
            this.allLists=this.Utility.arrangeListsByDescendingOrder(this.allLists);            
            this.errorMessage="";
            this.listName="";
          }         
        } else {
          //console.log(data);
          if(data.status===404){
            this.allLists=[];
          } else{
            this.router.navigate(['/error-page', data.status, data.message]);
          }          
        }        
      },
      error=>{
        //console.log(error);            
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
        this.allLists=[];
      }
    )
  }  
//--------------------------------------------------------------------------------------------------
  //-------------------------------functions - relating modal-----------------------------------------  
  public showEditListModal(listId, listName){
    //console.log(listId);
    //console.log(listName);
    this.listId=listId;
    this.listName=listName;
    $("#editListModal").show();
  }

  public closeEditModal(){
    $("#editListModal").hide(2000); 
  }   
  //------------------------------------------------------------------------------
public sendInputForNotification(data){
  console.log("SendInputForNotifications" + data);
  let message="";
  let happened="";
  console.log(this.fullName);
  if(data.action=="create"){
    happened="created";
    message=`List "${data.listName}" is ${happened}  by  ${this.fullName}`; 
  } else if(data.action=="edit"){
    happened="edited";
    message=`List "${data.listName}" is ${happened}  by  ${this.fullName}`;
  } else if(data.action=="delete"){
    happened="deleted";
    message=`List "${data.listName}" is ${happened}  by  ${this.fullName}`;
  }else{
    happened = "changed";
    message=`List "${data.listName}" is ${happened}  by  ${this.fullName}`;
  }
  let temp={
    type:data.type,
    action:data.action,
    typeId:data.listId,
    originId:data.originId,
    message:message,
    sendId:this.userId,
    sendName:this.fullName
  }
  console.log(temp);
  this.SocketService.sendCurrentNotification(temp);
}
//-----------------------------------------------------------------------------------------

public getChangeStatus(){
  this.SocketService.getChangeStatusList().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
      this.getAllListsMessage();
    }, (error)=>{
      console.log(error);
    }
  )
}


public changeStatus(originId){
  //console.log(originId);
  let data={
    type:"list",
    originId:originId
  }
  this.SocketService.changeStatus(data);
}


//-------------------------------------------------------
public getSuccessMessage():any{
  this.SocketService.getSuccessMessage().subscribe(
    data=>{
      //console.log(data);
      if(data.status===200){
        if(data.data.type==="list" && data.data.creatorId===this.userId){          
            this.sendInputForNotification(data.data);
            this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
            this.getAllListsMessage();                                
        }
      } else {
        this.router.navigate(['/error-page', data.status, data.message]);
      }
      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

//------------------------------------------------------
public getUndoSuccessMessage():any{
  this.SocketService.getUndoSuccessMessage().subscribe(
    data=>{      
      if(data.status===200){
        console.log(data.data.creatorId+"  :   "+this.userId);
        if(data.data.type==="list" && data.data.creatorId===this.userId){
        console.log(data);
        this.SocketService.getAllLists({userId:this.userId, fullName:this.fullName});
        this.getAllListsMessage();        
        }
      } else {
        this.router.navigate(['/error-page', data.status, data.message]);
      }
      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//------------------------------------------------------------------------------
//end of class definition
}
