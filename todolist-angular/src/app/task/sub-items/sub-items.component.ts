//import angular packages
import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import { UtilityService} from './../../utility.service';
//import user denfined services
import * as $ from 'jquery';


@Component({
  selector: 'app-sub-items',
  templateUrl: './sub-items.component.html',
  styleUrls: ['./sub-items.component.css']
})
export class SubItemsComponent implements OnInit {
  @Input() userId:string;
  
  public fullName:string;
  
  public pageOwnerName:string;
  /*

  public subItems:any=[];
  public subItemId:string;
  public subItemName:string;
  public newSubItem:string;

  public itemId:string;
  public itemName:string;
  public message:string;
  public errorMessage:string;
  public msgObj:any;
*/
  constructor(
    //instances : services
    private SocketService:SocketService,
    private UserService:UserService,
    private Utility:UtilityService,
    //others
    private router:Router 
  ) { }

  ngOnInit() {
    
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
    /*
    this.getItemDetails();    
    this.getAllSubItems();
    this.vacateSubItemBox();    
    this.getChangeStatusSubItem();
    this.getSuccessMessage();
    this.getUndoSuccessMessage();
    */
  }
//------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
/*
public getItemDetails(){
  this.SocketService.getItemDetails().subscribe(
    data=>{
      if(this.pageOwnerId===data.pageOwnerId){
        console.log(data); 
        this.itemName=data.itemName;
        this.itemId=data.itemId; 
        console.log(this.itemName+ " : "+this.itemId);    
        this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});
      }            
    }, (err)=>{      
      console.log(err);            
      this.router.navigate(['/error-page', err.error.status, err.error.message]);
    }
  )
}
//----------------------------------------------------------------------------------------------
public createSubItem(){
  if(!this.newSubItem){
    this.errorMessage="Please enter task item";
  }else if(this.newSubItem){
    let data={            
      subItemName:this.newSubItem,
      createdBy:this.fullName,
      creatorId:this.userId,
      userId:this.userId,      
      itemId:this.itemId,
      type:"subItem"      
    }
    console.log(data);     
    this.SocketService.createTask(data);    
    this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});  
    this.newSubItem="";     
  }    
}

public createSubItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createSubItem();
  }  
}
//-----------------------------------------------------------------------------------------------
public editSubItem(subItemId, subItemName){
  $("#subItemEditModal").hide(2000);   
  
  let data={    
    subItemId:subItemId,
    subItemName:subItemName,
    itemId:this.itemId,
    userId:this.userId,    
    changeId:this.userId,
    changeName:this.fullName,
    type:"subItem"      
  }
  //console.log(data);
  this.SocketService.editTask(data);      
}
//-----------------------------------------------------------------------------------------------
public deleteSubItem(id){  
  this.SocketService.deleteTask({subItemId:id, itemId:this.itemId, type:"subItem"});
}

//-------------------------------------------------------------------------------------
public getAllSubItems(){
    this.SocketService.getAllSubItems().subscribe(
      data=>{
        if(data.status===200 ){
        if(data.socketLoginId===this.userId){               
          this.subItems=data.data; 
          console.log(this.subItems);
          this.subItems=this.Utility.arrangeListsByDescendingOrder(this.subItems);
        } else {
          this.subItems=[];
          console.log("No sub-item in this item");
        } 
      } else{
        this.subItems=[];
      }
    }, (err)=>{
        console.log(err);
      }
    )
  }
  public vacateSubItemBox(){
    this.SocketService.vacateSubItemBox().subscribe(
      data=>{
        this.subItems=[];
        this.itemName="";
        console.log(data);
        this.message=data;
      }, (err)=>{
        console.log(err);
      }
    )
  }
  //--------------------------------------------------------------------------------------------------------
public sendInputForNotification(data){
  let message="";
  let happened="";
  console.log(this.fullName);
  if(data.action=="create"){
    happened="created";
    message=`Sub-Item "${data.subItemName}" is ${happened}  by  ${this.fullName}`; 
  } else if(data.action=="edit"){
    happened="edited";
    message=`Sub-Item "${data.subItemName}" is ${happened}  by  ${this.fullName}`;
  } else if(data.action=="delete"){
    happened="deleted";
    message=`Sub-Item "${data.subItemName}" is ${happened}  by  ${this.fullName}`;
  }else{
    happened = "changed";
    message=`Sub-Item "${data.subItemName}" is ${happened}  by  ${this.fullName}`;
  }
  let temp={
    type:"subItem",
    action:data.action,
    typeId:data.subItemId,
    originId:data.originId,
    message:message,
    sendId:this.userId,
    sendName:this.fullName
  }
  this.SocketService.sendCurrentNotification(temp);
}
//------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
public showSubItemEditModal(subItemId, subItemName){
  $("#subItemEditModal").show();
  this.subItemId=subItemId;
  this.subItemName=subItemName;  
}

public closeSubItemEditModal(){
  $("#subItemEditModal").hide(2000); 
}
//-----------------------------------------------------------------------------------------

public getChangeStatusSubItem(){
  this.SocketService.getChangeStatusSubItem().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId}); 
      this.getAllSubItems();
    }, (error)=>{
      console.log(error);
    }
  )
}


public changeStatus(originId){
  console.log(originId);
  let data={
    type:"subitem",
    originId:originId
  }
  this.SocketService.changeStatus(data);
}

//------------------------------------------------------------------------------------
//-------------------------------------------------------
public getSuccessMessage():any{
  this.SocketService.getSuccessMessage().subscribe(
    data=>{
      //console.log(data);
      if(data.status===200){
        if(data.data.type==="subItem" && data.data.creatorId===this.userId){
          this.sendInputForNotification(data.data); 
          this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});
          this.getAllSubItems();
          this.newSubItem="";
        } 
      }else{             
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
      console.log(data);
      if(data.status===200){       
        if(data.data.type==="subItem"  && data.data.creatorId===this.userId){
          console.log("matched");          
          this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});
          this.getAllSubItems();
          this.newSubItem="";
        }      
    } else {
        this.subItems=[];
    } 
   }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
*/
//----------------------------------------------------------------------------
}
