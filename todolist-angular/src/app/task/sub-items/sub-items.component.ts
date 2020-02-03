//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
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
    //others
    private router:Router 
  ) { }

  ngOnInit() {
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
    this.getItemDetails();
    this.getFriendDetails();
    this.getAllSubItems();
    this.vacateSubItemBox();
    this.getEditSubItemMessage();
    this.getDeleteSubItemMessage();
  }
//-----------------------------------------------------------------------------------------
public getFriendDetails(){
  this.SocketService.getFriendDetails().subscribe(    
    data=>{
      this.userId=data.id;
      this.fullName=data.fullName;        
    }
    
  ) 
  console.log(this.userId);
  console.log(this.fullName);
}
//--------------------------------------------------------------------------------------------
public getItemDetails(){
  this.SocketService.getItemDetails().subscribe(
    data=>{
      console.log(data); 
      this.itemName=data.itemName;
      this.itemId=data.itemId; 
      console.log(this.itemName+ " : "+this.itemId);    
      this.SocketService.getSubItemsByItemId({userId:this.userId, itemId:this.itemId});      
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
      changeBy:this.fullName,
      changeId:this.userId,
      userId:this.userId,      
      itemId:this.itemId      
    }
    console.log(data);     
    this.SocketService.addNewSubItem(data);    
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
    userId:this.userId,    
    modifierId:this.userId,
    modeifierName:this.fullName      
  }
  this.SocketService.editSubItem(data);      
}
//-----------------------------------------------------------------------------------------------
public deleteSubItem(id){
  let data={
    subItemId:id,
    itemId:this.itemId
  }
  console.log(data);
  this.SocketService.deleteSubItem(data);
}
//--------------------------------------------------------------------------------------------------
public getEditSubItemMessage():any{
  console.log("getEditSubItemMessage called");
  this.SocketService.getEditSubItemMessage().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      if(apiResponse.status===200){
        this.msgObj=apiResponse.data;
        this.subItemName=apiResponse.data.subItemName;
      
        let data={
          itemId:apiResponse.data.itemId,
          userId:this.userId
        }
        this.SocketService.getSubItemsByItemId(data);
      } else {

      }
             
    }, (err)=>{
        console.log(err);            
        this.router.navigate(['/error-page', err.error.status, err.error.message]);
    }
  )
}

public getDeleteSubItemMessage():any{
  console.log("getEditMessage called");
  this.SocketService.getDeleteSubItemMessage().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.msgObj=apiResponse.data;
      
      let data={
        itemId:apiResponse.data.itemId,
        userId:this.userId
      }
      this.SocketService.getSubItemsByItemId(data);
    }
  )
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
}
