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
public getCreateListMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('create-list-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
//-------------------------------------------------------------------------------------------
//getDeleteListMessage()
public getDeleteListMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('delete-list-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public getEditItemMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('edit-item-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getDeleteItemMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('delete-item-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public getEditListMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('edit-list-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public getEditSubItemMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('edit-sub-item-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public getDeleteSubItemMessage():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('delete-sub-item-message', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

//delete-item-message
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
public vacateItemBox():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('vacate-item-box', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })

}

public getAllSubItems():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-all-sub-items', (data)=>{
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
public getMessageFromFriend():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('msg-to-friend', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}

public getFriendList():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-friend-list', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
}
public getFriendDetails():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-friend-details', (data)=>{
      console.log(data);
      observer.next(data);
    })
  })
    
}
public getListDetails():Observable<any>{
  return Observable.create((observer)=>{
    this.socket.on('get-list-details-in-item-box', (listName)=>{
      console.log(listName);
      observer.next(listName);
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
public createList(data){
  console.log(data);
  this.socket.emit('create-list', data);
}
public editList(data){
  console.log(data);
  this.socket.emit('edit-list', data);
}
public deleteList(listId){
  console.log(listId);
  this.socket.emit('delete-list', listId);
}
public sendListDetailsToItemBox(data){
  console.log(data);
  this.socket.emit('send-list-details-to-item-box', data)
}
//-----------item realted events emitted---------------------
public addNewItem(data){
  console.log(data);
  this.socket.emit('add-new-item', data);
}

public editItem(data){
  console.log(data);
  this.socket.emit('edit-item', data);
}
public deleteItem(data){
  console.log(data);
  this.socket.emit('delete-item', data);
}
public getItemsByListId(data){
  console.log(data);
  this.socket.emit('items-by-list-id', data);
}
public sendItemDetailsToSubItemBox(data){
  console.log(data);
  this.socket.emit('send-item-details-to-sub-item-box', data)
}
public getSubItemsByItemId(data){
  console.log(data);
  this.socket.emit('sub-items-by-item-id', data);  
}
public addNewSubItem(data){
  console.log(data);
  this.socket.emit('add-new-sub-item', data);
}
public editSubItem(data){
  console.log(data);
  this.socket.emit('edit-sub-item', data);
}
public deleteSubItem(data){
  console.log(data);
  this.socket.emit('delete-sub-item', data);
}
//-----------friend realted events emitted---------------------
public sendFriendRequest(data){
  console.log(data);
  this.socket.emit('send-friend-request', data);
}
public showFriendList(userId){
  console.log(userId);
  this.socket.emit('show-friend-list', userId);
}
public sendFriendDetails(data){
  console.log(data);
  this.socket.emit('send-friend-details', data);
}

public acceptFriendRequest(data){
  console.log(data);
  this.socket.emit('accept-friend-request', data);
}

public includeUserAsFriend(data){
  console.log("include user as friend called");
  console.log(data);
  this.socket.emit("accept-friend-request", data);
}

//-------------------------------------------------------------------------------------------
}
