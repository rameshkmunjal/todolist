//import angular packages
import { Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import * as $ from 'jquery';
import { UtilityService } from 'src/app/utility.service';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  public authToken:string;
  public userId:string;
  public fullName:string;
  public listId:string;
  public listName:string;
  
  public itemId:string;
  public itemName:string;
  public newItem:string;
  public items:any=[];

  public errorMessage:string="";
  
  constructor(
    private SocketService:SocketService,
    private UserService:UserService,
    private TaskService:TaskService,    
    private Utility:UtilityService,
    private router:Router
  ) { }

  ngOnInit() { 
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.listClickResponse();  
    this.updateListPageResponse();
    this.undoResponse();  
    this.updateAfterUndoResponse();
  }
  //----------------------------------------------------------------
public listClickResponse(){  
  this.SocketService.listClickResponse().subscribe(
    data=>{
      console.log(data);
      this.userId=data.userId;
      this.fullName=data.fullName;
      this.listId=data.listId;
      this.listName=data.listName;
      
      this.getItemsByListId(this.userId, this.listId);
    }
  )
}

public getItemsByListId(userId, listId){ 
  console.log(userId);
  console.log(listId); 
  this.TaskService.getItemsByListId(this.authToken, userId, listId).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      if(apiResponse.data !==null && apiResponse.data !==undefined){
        this.items=apiResponse.data;
        //console.log(this.items);
      } else {
        this.items="";
        //console.log(apiResponse.message);
      }     
    }, (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

public createItem(){
  if(!this.newItem){
    this.errorMessage="Please input item name";
  }else if(this.newItem){
    let data={      
      itemName:this.newItem,
      listId:this.listId,
      listName:this.listName,
      createdBy:this.fullName,
      creatorId:this.userId,
      type:"item"
    } 
    console.log(data);       
    this.createNewItem(data);
  }    
}

public createItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createItem();
  }  
}

public createNewItem(data){
  console.log(data);
  this.TaskService.createItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.newItem="";
      let data={
        type:"item",
        userId:this.userId,        
        list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
      //this.itemClicked(apiResponse.data.typeId, apiResponse.data.name);
    }, (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

public deleteItem=(itemId)=>{
  //console.log(itemId);
  let data={
    itemId:itemId,
    changeBy:this.fullName,
    changeId:this.userId,
    type:"item",
    action:"delete"
  }
  this.TaskService.deleteItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      //console.log(apiResponse);
      let data={
        type:"item",
        userId:this.userId,        
        list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

//------------------------------------------------------------------------------------------------
public showEditModal(itemId, itemName){
  //this.vacateItemBox();    
  this.itemName=itemName;
  this.itemId=itemId;
  //(this.itemId, this.itemName);
  $("#editItemModal").show();    
}

public closeEditModal(){
  $("#editItemModal").hide(2000); 
}

public editItem(itemId){
  $("#editItemModal").hide(2000);    
  
  let data={            
    itemId:itemId,
    itemName:this.itemName,
    changeId:this.userId,
    changeName:this.fullName, 
    listId:this.listId,
    type:"item"     
  }
  ////console.log(data);
  this.editAItem(data);        
}

public editAItem(data){
  this.TaskService.editItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        type:"item",
        userId:this.userId,        
        list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//-----------------------------------------------------------------------------------------------------
public changeStatus(itemId){
  ////console.log(originId);
  let data={    
    itemId:itemId
  }
  this.changeItemStatus(data);
}

public changeItemStatus(data){
  this.TaskService.changeItemStatus(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
    console.log(apiResponse);
      let data={
        type:"item",
        userId:this.userId,        
        list:apiResponse.data
      }
      this.SocketService.updateListPage(data);
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}
//-----------------------------------------------------------------------------------
public updateListPageResponse=():any=>{
  this.SocketService.updateListPageResponse()
    .subscribe((data)=>{
      console.log(data);          
      if(this.userId===data.userId && data.type==="item"){
        console.log(data); 
        console.log("items component");                 
        this.getItemsByListId(this.userId, data.list.listId);                   
      } else if(this.userId===data.userId && data.type==="list"){ 
        console.log(data);
        this.listName=data.list.name; 
        this.getItemsByListId(this.userId, data.list.originId);
      }     
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
  //-------------------------------------------------------------------------
  public undoCreateItem(data){
    //console.log(data);
    this.TaskService.undoCreateItem(this.authToken, data).subscribe(
      apiResponse=>{
        //console.log(apiResponse);
        let data={
          userId:apiResponse.data.creatorId,        
          list:apiResponse.data
        }
        this.SocketService.updateAfterUndo(data);
      }, (error)=>{
        console.log(error);
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }

  public undoEditItem(data){
    this.userId=data.userId;    
    this.TaskService.undoEditItem(this.authToken, data).subscribe(
      apiResponse=>{
        //console.log(apiResponse);
        let data={
          userId:this.userId,        
          list:apiResponse.data
        }
        //console.log(data);
        this.SocketService.updateAfterUndo(data);      
      }, (error)=>{
          //.log(error);
          this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }
  public undoResponse(){
    this.SocketService.undoResponse().subscribe(
      data=>{ 
        //console.log(data);   
          if(data.type==="item"){
            if(data.action==="create"){
              this.undoCreateItem(data);
            } else if(data.action==="delete"){
              this.undoDeleteItem(data);
            } else if(data.action==="edit"){
              this.undoEditItem(data);
            }
          }         
      }
    )
  }
  public updateAfterUndoResponse(){
    this.SocketService.updateAfterUndoResponse().subscribe(
      data=>{
        //console.log("inside updateAfterUndoResponse");
        console.log(data);      
        if(this.userId===data.list.creatorId){        
          this.getItemsByListId(this.authToken, data.list.listId);      
        }          
      }
    )
  }
  //-------------------------------------------------------------------------
  
  public undoDeleteItem(data){
    //console.log(data);
    this.TaskService.undoDeleteItem(this.authToken, data).subscribe(
      apiResponse=>{
        //console.log(apiResponse);
        if(apiResponse.status===200){
          let data={
            userId:apiResponse.data.creatorId,          
            list:apiResponse.data
          }
          //console.log(data);
          this.SocketService.updateAfterUndo(data);
        }       
      }, (error)=>{
        //console.log(error);
        this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }

  public itemClicked(id, itemName){
    console.log("id of item clicked "+id);
    let data={
      userId:this.userId,
      fullName:this.fullName,
      itemId:id, 
      itemName:itemName
    }
    this.SocketService.itemClicked(data);
  }
  
  
//--------------------------------------------------------
}
