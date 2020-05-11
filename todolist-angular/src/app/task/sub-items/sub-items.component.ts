//import angular packages
import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
//import user denfined services
import { SocketService } from 'src/app/socket.service';
import { UserService } from 'src/app/user.service';
import { UtilityService} from './../../utility.service';
//import user denfined services
import * as $ from 'jquery';
import { TaskService } from 'src/app/task.service';


@Component({
  selector: 'app-sub-items',
  templateUrl: './sub-items.component.html',
  styleUrls: ['./sub-items.component.css']
})
export class SubItemsComponent implements OnInit {
  public authToken:string;
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
    private Utility:UtilityService,
    private TaskService:TaskService,
    //others
    private router:Router 
  ) { }

  ngOnInit() { 
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.itemClickResponse();  
    this.updateListPageResponse();
    this.undoResponse();  
    this.updateAfterUndoResponse();
    this.vacateSubItemBox();
  }
  //----------------------------------------------------------------
public itemClickResponse(){  
  this.itemName="";
  this.SocketService.itemClickResponse().subscribe(
    data=>{
      console.log(data);      
      this.userId=data.userId;
      this.fullName=data.fullName;
      this.itemId=data.itemId;
      this.itemName=data.itemName;
      this.getSubItemsByItemId(this.userId, this.itemId);
    })
}

public getSubItemsByItemId(userId, itemId){  
  this.TaskService.getSubItemsByItemId(this.authToken, userId, itemId).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      if(apiResponse.data !==null && apiResponse.data !==undefined){
        this.subItems=apiResponse.data;
      } else {        
        this.subItems="";
        console.log(apiResponse.message);
      }     
    }, (error)=>{
      console.log(error);
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    }
  )
}

public createSubItem(){
  if(!this.newSubItem){
    this.errorMessage="Please input sub item name";
  }else if(this.newSubItem){
    let data={      
      subItemName:this.newSubItem,
      itemId:this.itemId,
      createdBy:this.fullName,
      creatorId:this.userId,
      type:"subItem"
    }        
    this.createNewSubItem(data);
  }    
}

public createSubItemUsingKeypress: any = (event: any) => {
  if(event.keyCode===13){
    this.createSubItem();
  }  
}

public createNewSubItem(data){
  this.TaskService.createSubItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.newSubItem="";
      let data={
        type:"subItem",
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

public deleteSubItem=(subItemId)=>{
  console.log(subItemId);
  let data={
    subItemId:subItemId,
    changeBy:this.fullName,
    changeId:this.userId,
    type:"subItem",
    action:"delete"
  }
  this.TaskService.deleteSubItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        type:"subItem",
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
public showSubItemEditModal(subItemId, subItemName){
  //this.vacateItemBox();    
  this.subItemName=subItemName;
  this.subItemId=subItemId;
  console.log(this.subItemId, this.subItemName);
  $("#editSubItemModal").show();    
}

public closeEditModal(){
  $("#editSubItemModal").hide(2000); 
}

public editSubItem(subItemId){
  $("#editSubItemModal").hide(2000);    
  
  let data={            
    subItemId:subItemId,
    subItemName:this.subItemName,
    changeId:this.userId,
    changeName:this.fullName, 
    itemId:this.itemId,
    type:"subItem"     
  }
  console.log(data);
  this.editASubItem(data);        
}

public editASubItem(data){
  this.TaskService.editSubItem(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        type:"subItem",
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
public changeStatus(subItemId){
  ////console.log(originId);
  let data={    
    subItemId:subItemId
  }
  this.changeSubItemStatus(data);
}

public changeSubItemStatus(data){
  this.TaskService.changeSubItemStatus(this.authToken, this.userId, data).subscribe(
    apiResponse=>{
      console.log(apiResponse);
      let data={
        type:"subItem",
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
      if(this.userId===data.userId && data.type==="subItem"){ 
        console.log("userId matched"); 
        console.log(this.userId);
        console.log(data.list.listId);          
        this.getSubItemsByItemId(this.userId, data.list.listId);                   
      }      
    }, (error)=>{
      this.router.navigate(['/error-page', error.error.status, error.error.message]);
    })
}
  //-------------------------------------------------------------------------
  public undoCreateSubItem(data){
    //console.log(data);
    this.TaskService.undoCreateSubItem(this.authToken, data).subscribe(
      apiResponse=>{
        console.log(apiResponse);
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

  public undoEditSubItem(data){
    this.userId=data.userId;    
    this.TaskService.undoEditSubItem(this.authToken, data).subscribe(
      apiResponse=>{
        console.log(apiResponse);
        let data={
          userId:this.userId,        
          list:apiResponse.data
        }
        console.log(data);
        this.SocketService.updateAfterUndo(data);      
      }, (error)=>{
          //console.log(error);
          this.router.navigate(['/error-page', error.error.status, error.error.message]);
      }
    )
  }
  public undoResponse(){
    this.SocketService.undoResponse().subscribe(
      data=>{ 
        console.log(data);   
          if(data.type==="subItem"){
            if(data.action==="create"){
              this.undoCreateSubItem(data);
            } else if(data.action==="delete"){
              this.undoDeleteSubItem(data);
            } else if(data.action==="edit"){
              this.undoEditSubItem(data);
            }
          }         
      }
    )
  }
  public updateAfterUndoResponse(){
    this.SocketService.updateAfterUndoResponse().subscribe(
      data=>{
        console.log("inside updateAfterUndoResponse");
        console.log(data);      
        if(this.userId===data.list.creatorId){        
          this.getSubItemsByItemId(this.authToken, data.list.itemId);      
        }          
      }
    )
  }
  //-------------------------------------------------------------------------
  
  public undoDeleteSubItem(data){
    console.log(data);
    this.TaskService.undoDeleteSubItem(this.authToken, data).subscribe(
      apiResponse=>{
        console.log(apiResponse);
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
  
  public vacateSubItemBox(){
    this.SocketService.vacateSubItemBox().subscribe(
      data=>{ 
        console.log(data);   
        this.subItems="";
        this.itemName="";          
      }
    )
  } 
//--------------------------------------------------------
}
