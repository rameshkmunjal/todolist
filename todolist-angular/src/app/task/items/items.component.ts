//import angular packages
import { Component, OnInit, Input} from '@angular/core';
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
  @Input() userId:string;
  
  public fullName:string;
  /*
  
  public pageOwnerName:string;
  public pageType:string;

  public items:any=[];
  public itemId:string;
  public itemName:string;
  public newItem:string;

  public listId:string;
  public listName:string;

  public message:string="No item to display";
  public msgObj:any;
  public errorMessage:string;
*/
  constructor(
    private SocketService:SocketService,    
    private Utility:UtilityService,
    private router:Router
  ) { }

  ngOnInit() { 
    /*   
    this.getListDetails();
    this.getAllItems();
    this.vacateItemBox();    
    this.getChangeStatusItem();
    this.getSuccessMessage();
    this.getUndoSuccessMessage();
    */
  }
  //----------------------------------------------------------------
  /*
  public getUserDetails(){
    this.SocketService.getUserDetails().subscribe(
      data=>{
        this.pageOwnerId=data.pageOwnerId;
        this.userId=data.userId;
        this.fullName=data.fullName; 
        this.pageType=data.pageType;
      }
    )   
  }
  
//----------------------------------------------------------------------------------
  public getAllItems(){
    this.SocketService.getAllItems().subscribe(
      data=>{ 
        //console.log("Get All Items response -- " + JSON.stringify(data));    
        if(data.status===200){ 
          if(data.socketLoginId===this.userId){         
              this.items=data.data;            
              this.items=this.Utility.arrangeListsByDescendingOrder(this.items);
            }
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
      if(data.pageOwnerId===this.pageOwnerId){
        console.log(data.pageOwnerId);
        console.log(this.pageOwnerId);
          this.listName=data.listName; 
          this.listId=data.listId;  
          this.userId=data.userId; 
          this.fullName=data.fullName; 
          console.log(this.listName);
          this.SocketService.getItemsByListId({
            listName:this.listName, 
            listId:this.listId, 
            userId:this.userId,
            fullName:this.fullName
          });
        }             
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
      creatorId:this.userId,
      type:"item"
    }        
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
    userId:this.userId,
    pageOwnerId:this.pageOwnerId
  }
  this.SocketService.sendItemDetailsToSubItemBox(d); 
}
//--------------------------------------------------------------------------------------------------------
public sendInputForNotification(data){
  let message="";
  let happened="";
  console.log(this.fullName);
  if(data.action=="create"){
    happened="created";
    message=`Item "${data.itemName}" is ${happened}  by  ${this.fullName}`; 
  } else if(data.action=="edit"){
    happened="edited";
    message=`Item "${data.itemName}" is ${happened}  by  ${this.fullName}`;
  } else if(data.action=="delete"){
    happened="deleted";
    message=`Item "${data.itemName}" is ${happened}  by  ${this.fullName}`;
  }else{
    happened = "changed";
    message=`Item "${data.itemName}" is ${happened}  by  ${this.fullName}`;
  }
  let temp={
    type:"item",
    action:data.action,
    typeId:data.itemId,
    originId:data.originId,
    message:message,
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

//-----------------------------------------------------------------------------------------------
public getSuccessMessage():any{
  this.SocketService.getSuccessMessage().subscribe(
    data=>{
      if(data.status===200){ 
        if(data.data.type==="item" && data.data.creatorId===this.userId){
          
          this.sendInputForNotification(data.data);         
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
      console.log(data);
      if(data.status===200){       
        if(data.data.type==="item"  && data.data.creatorId===this.userId){          
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
*/

}
