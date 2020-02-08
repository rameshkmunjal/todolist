//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import * as $ from 'jquery';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  public userId:string;
  public fullName:string;
  public pageOwnerId:string;
  public pageOwnerName:string;
  public pageType:string;

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
    private Utility:UtilityService,
    private router:Router
  ) { }

  ngOnInit() { 
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;
    this.pageOwnerId=this.userId;   
    this.getUserDetails();
    this.getAllItems();
    this.getListDetails();
    this.vacateItemBox();    
    this.getChangeStatusItem();
    this.getSuccessMessage();
    this.getUndoSuccessMessage();
    
  }
  //----------------------------------------------------------------
  
  public getUserDetails(){
    this.SocketService.getUserDetails().subscribe(
      data=>{
        this.userId=data.id;
        this.fullName=data.fullName; 
        this.pageType="friend"       
      }
    )   
  }
  
//----------------------------------------------------------------------------------
  public getAllItems(){
    this.SocketService.getAllItems().subscribe(
      apiResponse=>{ 
        console.log("Get All Items response -- " + JSON.stringify(apiResponse));    
        if(apiResponse.status===200){
          console.log("comparing userIds in item.compoent  "+ this.userId + " : "+apiResponse.socketLoginId);
          //if(apiResponse.socketLoginId===this.pageOwnerId && this.listId===apiResponse.data[0].listId){
            this.items=apiResponse.data;
            //console.log(this.items);
            //this.items=this.Utility.arrangeListsByDescendingOrder(this.items);
          } else {
            this.items=[];
            console.log("There is no items in this list");          
          }//else closed
               
        }, (err)=>{
          console.log(err);            
          this.router.navigate(['/error-page', err.error.status, err.error.message]);
        })
  }

  public getListDetails(){
    this.SocketService.getListDetails().subscribe(
      data=>{
        console.log(data);
        console.log(this.userId+"  :  "+data.userId)
        
          this.listName=data.listName; 
          this.listId=data.listId;  
          this.userId=data.userId; 
          this.fullName=data.fullName; 
          this.SocketService.getItemsByListId(data);
                      
      }, (err)=>{
        //console.log(err);
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
      creatorId:this.userId,
      type:"item"
    }
    //console.log(data);     
    this.SocketService.createTask(data);
  }    
}

public createItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createItem();
  }  
}


//-----------------------------------------------------------------------------------------------------

  public editItem(itemId){
    $("#editItemModal").hide(2000);    
    
    let data={            
      itemId:this.itemId,
      itemName:this.itemName,
      userId:this.userId,
      changeName:this.fullName, 
      listId:this.listId,
      type:"item"     
    }
    //console.log(data);
    this.SocketService.editTask(data);        
  }
  //------------------------------------------------
  public deleteItem(id){    
    this.SocketService.deleteTask({itemId:id, listId:this.listId, type:"item"});
  }
  //----------------------------------------------------------------
  public vacateItemBox(){
    this.SocketService.vacateItemBox().subscribe(
      data=>{
        this.items=[];
        this.listName="";        
        this.message=data;
      }, (err)=>{
        console.log(err);
      }
    )
  }
//------------------------------------------------------------------------------------------------
  public showEditModal(itemId, itemName){
    //this.vacateItemBox();    
    this.itemName=itemName;
    this.itemId=itemId;
    $("#editItemModal").show();    
  }

  public closeEditModal(){
    $("#editItemModal").hide(2000); 
  }
//-----------------------------------------------------------------------------------------------------
public showSubItems(itemId, itemName){
  //console.log(itemId+" : "+itemName);  
  this.itemName=itemName;
  this.itemId=itemId;
  let data={
    itemId:itemId,
    userId:this.userId
  }  
  this.SocketService.getSubItemsByItemId(data); 
  let d={
    itemId:itemId,
    itemName:itemName, 
    userId:this.userId
  }
  this.SocketService.sendItemDetailsToSubItemBox(d); 
}
//--------------------------------------------------------------------------------------------------------
public sendInputForNotification(data,action, happened){
  let temp={
    type:"item",
    action:action,
    typeId:data.itemId,
    originId:data.originId,
    message:"Item "+data.itemName+" in List "+ this.listName +" is "+ happened + " by " +this.fullName,
    sendId:this.userId,
    sendName:this.fullName
  }
  this.SocketService.sendCurrentNotification(temp);
}
//------------------------------------------------------------------------------------------------

public getChangeStatusItem(){
  this.SocketService.getChangeStatusItem().subscribe(
    data=>{
      if(data.status===200){
      //console.log(apiResponse);
      this.SocketService.getItemsByListId({listId:this.listId, userId:this.userId});
      this.getAllItems();
    }else {
      this.router.navigate(['/error-page', data.status, data.message]);
    } 
   }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
public changeStatus(originId){
  //console.log(originId);
  let data={
    type:"item",
    originId:originId
  }
  this.SocketService.changeStatus(data);
}

//-------------------------------------------------------------------------------------------
public getSuccessMessage():any{
  this.SocketService.getSuccessMessage().subscribe(
    data=>{
      if(data.status===200){       
        if(data.data.type==="item"){
          
          this.SocketService.getItemsByListId({listId:this.listId, userId:this.userId});
          this.getAllItems();
          this.newItem="";
        }      
    } else {
      this.router.navigate(['/error-page', data.status, data.message]);
    } 
   }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//-------------------------------------------------------------------------
public getUndoSuccessMessage():any{
  this.SocketService.getUndoSuccessMessage().subscribe(
    data=>{
      if(data.status===200){       
        if(data.data.type==="item"){          
          this.SocketService.getItemsByListId({listId:this.listId, userId:this.userId});
          this.getAllItems();
          this.newItem="";
        }      
    } else {
      this.router.navigate(['/error-page', data.status, data.message]);
    } 
   }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//---------------------------------------------------------------


}
