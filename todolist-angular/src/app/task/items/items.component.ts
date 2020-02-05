//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  public userId:string;
  public fullName:string;

  public items:any=[];
  public itemId:string;
  public itemName:string;
  public newItem:string;

  public listId:string;
  public listName:string;

  public message:string;
  public msgObj:any;
  public errorMessage:string;

  constructor(
    private SocketService:SocketService,
    private UserService:UserService,
    private router:Router
  ) { }

  ngOnInit() {
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
    this.getFriendDetails();
    this.getAllItems();
    this.getListDetails();
    this.vacateItemBox();
    this.getCreateItemMessage();
    this.getEditItemMessage();
    this.getDeleteItemMessage()
    
  }
  //----------------------------------------------------------------
  public getFriendDetails(){
    this.SocketService.getFriendDetails().subscribe(
      data=>{
        this.userId=data.id;
        this.fullName=data.fullName;        
      }
    )   
  }
//----------------------------------------------------------------------------------
  public getAllItems(){
    this.SocketService.getAllItems().subscribe(
      apiResponse=>{     
        if(apiResponse.status===200){
          //if(apiResponse.socketLoginId===this.userId){
          this.items=apiResponse.data;
          console.log(this.items);
        } else {
          this.items=[];
          console.log("There is no items in this list");
          
        }        
      }, (err)=>{
        console.log(err);            
        this.router.navigate(['/error-page', err.error.status, err.error.message]);
      }
    )
  }

  public getListDetails(){
    this.SocketService.getListDetails().subscribe(
      data=>{
        console.log(data); 
        this.listName=data.listName; 
        this.listId=data.listId;  
        this.userId=data.userId;  
        this.SocketService.getItemsByListId(data);      
      }, (err)=>{
        console.log(err);
      }
    )
  }
//-----------------------------------------------------------------------------------------
public createItem(){
  if(!this.newItem){
    this.errorMessage="Please input item name";
  }else if(this.newItem){
    let data={      
      itemName:this.newItem,
      listId:this.listId,
      createdBy:this.fullName,
      creatorId:this.userId
    }
    console.log(data);     
    this.SocketService.createItem(data);
  }    
}

public createItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createItem();
  }  
}


public getCreateItemMessage():any{
  console.log("getCreateMessage called");
  this.SocketService.getCreateItemMessage().subscribe(
    apiResponse=>{
      if(apiResponse.status===200){
        console.log(apiResponse);
        this.msgObj=apiResponse.data;
        this.sendInputForNotification(this.msgObj, "create", "created");
        this.SocketService.getItemsByListId({listId:this.listId, userId:this.userId}); 
        this.newItem=""; 
      } else{
        console.log(apiResponse);
        this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
      }
    }, 
    (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
      })
}
//-----------------------------------------------------------------------------------------------------

  public editItem(itemId){
    $("#editItemModal").hide(2000);    
    console.log("item id is :"+itemId);
    console.log("item name : "+this.itemName);
    let data={            
      itemId:this.itemId,
      itemName:this.itemName,
      userId:this.userId,
      changeName:this.fullName, 
      listId:this.listId      
    }
    console.log(data);
    this.SocketService.editItem(data);        
  }
  //------------------------------------------------
  public deleteItem(id){    
    this.SocketService.deleteItem({itemId:id, listId:this.listId});
  }
  //----------------------------------------------------------------
  public getDeleteItemMessage():any{
    console.log("getDeleteItemMessage called");
    this.SocketService.getDeleteItemMessage().subscribe(
      apiResponse=>{
        console.log(apiResponse);
        this.msgObj=apiResponse.data;  
        this.msgObj=apiResponse.data;
        this.sendInputForNotification(this.msgObj, "delete", "deleted");      
        this.SocketService.getItemsByListId({userId:this.userId,listId:this.listId});
      }
    )
  }
//---------------------------------------------------------------------------------------
  public vacateItemBox(){
    this.SocketService.vacateItemBox().subscribe(
      data=>{
        this.items=[];
        this.listName="";
        console.log(data);
        this.message=data;
      }, (err)=>{
        console.log(err);
      }
    )
  }
  
//----------------------------------------------------------------------------------------------
public getEditItemMessage():any{
  console.log("getEditMessage called");
  this.SocketService.getEditItemMessage().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      if(apiResponse.status===200){
        this.itemName=apiResponse.data.itemName;
        this.msgObj=apiResponse.data;        
        this.sendInputForNotification(this.msgObj, "edit", "edited");
        this.SocketService.getItemsByListId({listId:this.listId, userId:this.userId});
      } else {
        console.log(apiResponse);
        this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
      }
    }, (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
//------------------------------------------------------------------------------------------------
  public showEditModal(itemId, itemName){
    this.vacateItemBox();
    console.log(this.listId +"  :  "+ this.listName);
    console.log(itemId+" : "+itemName);
    this.itemName=itemName;
    this.itemId=itemId;
    $("#editItemModal").show();    
  }

  public closeEditModal(){
    $("#editItemModal").hide(2000); 
  }
//-----------------------------------------------------------------------------------------------------
public showSubItems(itemId, itemName){
  console.log(itemId+" : "+itemName);  
  this.itemName=itemName;
  this.itemId=itemId;
  let data={
    itemId:itemId,
    userId:this.userId
  }  
  this.SocketService.getSubItemsByItemId(data); 
  let d={
    itemId:itemId,
    itemName:itemName
  }
  this.SocketService.sendItemDetailsToSubItemBox(d); 
}
//--------------------------------------------------------------------------------------------------------
public sendInputForNotification(data,action, happened){
  let temp={
    type:"item",
    action:action,
    typeId:data.itemId,
    message:"Item "+data.itemName+" in List "+ this.listName +" is "+ happened + " by " +this.fullName,
    sendId:this.userId,
    sendName:this.fullName
  }
  this.SocketService.sendCurrentNotification(temp);
}
//------------------------------------------------------------------------------------------------
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
    type:"item",
    originId:originId
  }
  this.SocketService.changeStatus(data);
}
*/
//------------------------------------------------------------------------------------------
}
