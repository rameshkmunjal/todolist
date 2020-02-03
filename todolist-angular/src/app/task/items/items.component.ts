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
    this.errorMessage="Please enter task item";
  }else if(this.newItem){
    let data={
      listId:this.listId,
      itemName:this.newItem,
      changeBy:this.fullName,
      changeId:this.userId
    }
    console.log(data);     
    this.SocketService.addNewItem(data);
    let d={
      listId:this.listId,
      userId:this.userId
    }
    
    this.SocketService.getItemsByListId(d); 
    this.newItem="";     
  }    
}

public createItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createItem();
  }  
}
//---------------------------------------------------------------------------------------------------

  public editItem(itemId){
    $("#editItemModal").hide(2000);    
    console.log("item id is :"+itemId);
    console.log("item name : "+this.itemName);
    let data={
      listId:this.listId,      
      itemId:this.itemId,
      itemName:this.itemName,
      modifierId:this.userId,
      modeifierName:this.fullName      
    }
    console.log(data);
    this.SocketService.editItem(data);        
  }
  //------------------------------------------------
  public deleteItem(id){
    let data={
      itemId:id,
      listId:this.listId
    }
    console.log(data);
    this.SocketService.deleteItem(data);
    let d={
      userId:this.userId,
      listId:this.listId
    }
    this.SocketService.getItemsByListId(d);
  }
  //----------------------------------------------------------------
  public getDeleteItemMessage():any{
    console.log("getEditMessage called");
    this.SocketService.getDeleteItemMessage().subscribe(
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
      this.msgObj=apiResponse.data;
      this.itemName=apiResponse.data.itemName;
      
      let data={
        listId:apiResponse.data.listId,
        userId:this.userId
      }
      this.SocketService.getItemsByListId(data);        
    }
  )
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
}
