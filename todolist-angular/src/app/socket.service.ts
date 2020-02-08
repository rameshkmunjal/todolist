import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url='http://18.188.89.46:3000';
  private socket;

  constructor() {
    this.socket=io(this.url);
  }
  //------------------------------Socket - Event Listeners-----------------------------------
public verifyUser():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('verify-user', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public onlineUserList():Observable<any>{
  return Observable.create(observer=>{
    this.socket.on('online-user-list', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//---------------------------------------------------------------------------------------
public getAllListsMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-all-lists-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getAllItems():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-all-items', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
} 
//
public getAllSubItems():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-all-sub-items', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
} 
public vacateItemBox():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('vacate-item-box', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public vacateSubItemBox():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('vacate-sub-item-box', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//---------------------------------------------------------------------------------------
public messageByUserId = (userId) => {
  console.log(userId);
  return Observable.create((observer) => {      
    this.socket.on(userId, (data) => {
      console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
} // end chatByUserId
//----------------------------------------------------------------------------------------

public getUserDetails():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-user-details', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })    
}
//---------------------------------------------------------------------------------------
public getListDetails():Observable<any>{
  return Observable.create((observer)=>{    
    this.socket.on('get-list-details-in-item-box', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getItemDetails():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-item-details-in-sub-item-box', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//---------------------------------------------------------------------------------------------------
public getChangeStatusList():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-change-status-list', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getChangeStatusItem():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-change-status-item', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getChangeStatusSubItem():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-change-status-sub-item', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//-------------------------------Notifications--------------------------------------------
public getCurrentNotification():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-current-notification', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//------------------------------------------------------------------------------------------
public getSuccessMessage():Observable<any>{  
  return Observable.create((observer)=>{
    this.socket.on('get-success-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//getUndoSuccessMessage()
public getUndoSuccessMessage():Observable<any>{  
  return Observable.create((observer)=>{
    this.socket.on('undo-success-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//------------events to be emiitted-------------------------------------------------------
public setUser(authToken){
  this.socket.emit('set-user', authToken);
}
public exitSocket(){
  this.socket.disconnect();
}
//-----------list realted events emitted---------------------
public getAllLists(data){
  console.log(data);
  this.socket.emit('get-all-lists', data);
}
public createTask(data){
  console.log(data);
  this.socket.emit('create-task', data);
}
public editTask(data){
  console.log(data);
  this.socket.emit('edit-task', data);
}
public deleteTask(data){
  console.log(data);
  this.socket.emit('delete-task', data);
}

//-----------item realted events emitted---------------------

public getItemsByListId(data){  
  console.log("Get Items By List Id -- " + JSON.stringify(data));
  this.socket.emit('items-by-list-id', data);
}
public getSubItemsByItemId(data){
  console.log(data);
  this.socket.emit('sub-items-by-item-id', data);  
}
//-----------------------------------------------------------------------------------------------------
public sendListDetailsToItemBox(data){
  console.log(data);
  this.socket.emit('send-list-details-to-item-box', data)
}
public sendItemDetailsToSubItemBox(data){
  console.log(data);
  this.socket.emit('send-item-details-to-sub-item-box', data)
}
//----------------------------------------------------------
public changeStatus(data){
  console.log(data);
  this.socket.emit('change-status', data);
}
//----------------------------------------------------------------
public undoLastChange(data){
  console.log(data);
  if(data.action==="delete"){
    this.socket.emit('undo-delete', data);
  } else if (data.action==="create"){
    this.socket.emit('undo-create', data);
  } else if(data.action==="edit"){
    this.socket.emit('undo-edit', data);
  }  
}
//-----------friend realted events emitted---------------------
public sendFriendRequest(data){
  console.log(data);
  this.socket.emit('send-friend-request', data);
}
public acceptFriendRequest(data){
  console.log(data);
  this.socket.emit('accept-friend-request', data);
}
//------------------------------------------------------------------
public sendUserDetails(data){
  console.log(data);
  this.socket.emit('send-user-details', data);
}
//---------------------------------Notifications-----------------------------------------------
public sendCurrentNotification(data){
  console.log(data);
  this.socket.emit("send-current-notification", data);
}

public showNotifications(){
  let data={};
  this.socket.emit("show-all-notifications", data);
}
public sendNotifArray(data){
  this.socket.emit('send-notifications-array', data);
}
//----------------------------------------------------------------------------------------------
}
