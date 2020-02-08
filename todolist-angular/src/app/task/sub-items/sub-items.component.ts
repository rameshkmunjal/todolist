//import angular packages
import { Component, OnInit } from '@angular/core';
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
  public userId:string;
  public fullName:string;
  public pageOwnerId:string;
  public pageOwnerName:string;

  public subItems:any=[];
  public subItemId:string;
  public subItemName:string;
  public newSubItem:string;

  public itemId:string;
  public itemName:string;
  public message:string;
  public errorMessage:string;
  public msgObj:any;

  constructor(
    //instances : services
    private SocketService:SocketService,
    private UserService:UserService,
    private Utility:UtilityService,
    //others
    private router:Router 
  ) { }

  ngOnInit() {
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
    //this.pageOwnerId=this.userId;
    //this.pageOwnerName=this.fullName;
    //this.getUserDetails();
    this.getItemDetails();    
    this.getAllSubItems();
    this.vacateSubItemBox();    
    this.getChangeStatusSubItem();
    this.getSuccessMessage();
  }
//-----------------------------------------------------------------------------------------
/*
public getUserDetails(){
  this.SocketService.getUserDetails().subscribe(    
    data=>{
      this.userId=data.id;
      this.fullName=data.fullName;        
    }
    
  ) 
  console.log(this.userId);
  console.log(this.fullName);
}
*/
//--------------------------------------------------------------------------------------------
public getItemDetails(){
  this.SocketService.getItemDetails().subscribe(
    data=>{
      if(this.userId===data.userId){
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
  console.log(data);
  this.SocketService.editTask(data);      
}
//-----------------------------------------------------------------------------------------------
public deleteSubItem(id){  
  this.SocketService.deleteTask({subItemId:id, itemId:this.itemId, type:"subItem"});
}

//-------------------------------------------------------------------------------------
public getAllSubItems(){
    this.SocketService.getAllSubItems().subscribe(
      apiResponse=>{
        console.log(apiResponse);
        console.log(apiResponse.socketLoginId);

        if(apiResponse.status===200){
          console.log(this.userId);        
          this.subItems=apiResponse.data; 
          console.log(this.subItems);
          //this.subItems=this.Utility.arrangeListsByDescendingOrder(this.subItems);
        } else {
          this.subItems=[];
          console.log("No sub-item in this item");
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
public sendInputForNotification(data,action, happened){
  let temp={
    type:"subItem",
    action:action,
    typeId:data.subItemId,
    originId:data.originId,
    message:"Sub-Item "+data.subItemName+" in Item "+ this.itemName +" is "+ happened + " by " +this.fullName,
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
      if(data.status===200){
        if(data.data.type==="subItem"){
          this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});
          this.getAllSubItems();
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
}
