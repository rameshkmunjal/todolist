import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url='http://localhost:3000';
  private socket;

  constructor() {
    this.socket=io(this.url);
  }
  //------------------------------Socket - Event Listeners-----------------------------------
public verifyUser():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('verify-user', (data)=>{
      ////console.log(data);
      observer.next(data);
    })
  })
}

public onlineUserList():Observable<any>{
  return Observable.create(observer=>{
    this.socket.on('online-user-list', (data)=>{
      ////console.log(data);
      observer.next(data);
    })
  })
}
//-------------------------------------------------------------------------------------
public messageByUserId(userId):Observable<any>{
  //console.log(userId);
  return Observable.create((observer) => {      
    this.socket.on(userId, (data) => {
     // //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
} // end chatByUserId
//listed
public getHomePageLoad():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-home-page-load', (data) => {     
      observer.next(data);
    }); // end Socket
  }); // end Observable
} 
//listed
public getFriendPageLoad():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-friend-page-load', (data) => {     
      observer.next(data);
    }); // end Socket
  }); // end Observable
}

public getContactListResponse():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-contact-list-response', (data) => { 
      //console.log(data);    
      observer.next(data);
    }); // end Socket
  }); // end Observable
}

public getNotificationListResponse():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-notification-list-response', (data) => {     
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
/*
public getFriendRequestResponse():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-friend-request-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
*/
public listClickResponse():Observable<any>{ 
  //console.log("update list page response"); 
  return Observable.create((observer) => {      
    this.socket.on('list-click-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
public itemClickResponse():Observable<any>{ 
  //console.log("update sub item page response"); 
  return Observable.create((observer) => {      
    this.socket.on('item-click-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
public updateListPageResponse():Observable<any>{ 
  //console.log("update list page response"); 
  return Observable.create((observer) => {      
    this.socket.on('update-list-page-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
public getFriendRequest():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('send-friend-request-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
//listed
//update-contact-friend-response', data
public getFriendsUpdated():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('update-friend-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
//'public-notification-response'
public getPublishNotification():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('public-notification-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}
//'get-last-change-object', notificationCB
public getLastChangeObject():Observable<any>{  
  return Observable.create((observer) => {      
    this.socket.on('get-last-change-object', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable
}

public undoResponse():Observable<any>{
  return Observable.create((observer) => {      
    this.socket.on('undo-last-action-response', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable 
}

public updateAfterUndoResponse():Observable<any>{
  //console.log("undoAterUndoResponse happened at FE side");
  return Observable.create((observer) => {      
    this.socket.on('update-after-undo-response', (data) => {
      console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable 
}

public vacateSubItemBox(){
  return Observable.create((observer) => {      
    this.socket.on('vacate-sub-item-box', (data) => {
      //console.log(data);
      observer.next(data);
    }); // end Socket
  }); // end Observable 
  
}

//-------------------Events-----------------------------------------------
public setUser(authToken){
  this.socket.emit('set-user', authToken);
}
public loadHomePage(data){
  this.socket.emit('load-home-page-event', data);
}
public loadFriendPage(data){
  ////console.log(data);
  this.socket.emit('load-friend-page-event', data);
}
public showContactList(data){
  //console.log(data);
  this.socket.emit('show-contact-list-event', data);
}
public sendFriendRequest(data){
  ////console.log(data);
  this.socket.emit('send-friend-request-event', data);
}
public acceptFriendRequest(data){
  ////console.log(data);
  this.socket.emit('accept-friend-request-event', data);
}
public updateFriendList(data){
  ////console.log(data);
  this.socket.emit('update-friend-event', data);
}
public showNotificationList(data){
  ////console.log(data);
  this.socket.emit('show-notification-list-event', data);
}
public publishNotification(data){
  ////console.log(data);
  this.socket.emit('public-notification-event', data); 
}
public fireLastChangeEvent(data){
  //console.log(data);
  this.socket.emit('latest-change-event', data);
}



//--------------------------------------------------------------------------------------
public listClicked(data){
  this.socket.emit('list-click-event', data);
}
public itemClicked(data){
  console.log(data);
  this.socket.emit('item-click-event', data);
}
public updateListPage(data){
  //console.log(data);
  this.socket.emit('update-list-page-event', data);
}
public undoLastAction(data){
  //console.log(data);
  this.socket.emit('undo-last-action', data);
}
public updateAfterUndo(data){
  //console.log("update after undo");
  //console.log(data);
  this.socket.emit('update-after-undo', data);
}
//---------------------------------------------------------------------------------------
}
