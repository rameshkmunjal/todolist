import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from'@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url:string='http://localhost:3000/api/v1/todolist';

  constructor(
    private http:HttpClient
  ) { }

  public getAllListsOfAUser(authToken, userId):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/all-lists/${userId}`);
  }

  public getAllNotifications(authToken, userId):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/all-notifications/${userId}`);
  }

  public getLatestNotification(authToken, userId):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/notifications/${userId}`);
  }
  public createNotification(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('type', data.type)
      .set('action', data.action)
      .set('typeId', data.typeId)
      .set('originId',data.originId)
      .set('message', data.message)
      .set('sendId', data.sendId)
      .set('sendName', data.sendName);
    return this.http.post(`${this.url}/${authToken}/create-notification/${userId}`, params); 
  }

  public createList(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('listName', data.listName )
      .set('userName', data.userName)
      .set('creatorId', data.creatorId)
      .set('createdBy', data.createdBy);
    return this.http.post(`${this.url}/${authToken}/create-list/${userId}`, params);
  }
  public deleteList(authToken, data):Observable<any>{
    let params=new HttpParams()      
      .set('listId', data.listId)
      .set('changeBy', data.changeBy)
      .set('changeId', data.changeId)
      .set('type', data.type)
      .set('action', data.action)      
    return this.http.post(`${this.url}/${authToken}/delete-list`, params);
  }
  public editList(authToken, data):Observable<any>{
    let params=new HttpParams()      
      .set('listId', data.listId)
      .set('listName', data.listName)      
      .set('changeId', data.changeId)
      .set('changeName', data.changeName)
      .set('type', data.type)
      .set('action', data.action); 
      
    return this.http.post(`${this.url}/${authToken}/edit-list`, params);
  }

  public changeListStatus(authToken, data):Observable<any>{
    let params=new HttpParams()      
      .set('listId', data.listId)
      .set('type', data.type)
      .set('action', data.action)
      .set('changeName', data.changeName)
      .set('userId', data.userId);

      return this.http.post(`${this.url}/${authToken}/change-status-list`, params);
  }

  public undoCreateList(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-create-list`, params); 
  }

  public undoEditList(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('refkey', data.refkey)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-edit-list`, params); 
  }

  public undoDeleteList(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-delete-list`, params); 
  }
  //-----------------------------------------------------------------------
  public getItemsByListId(authToken, userId, listId):Observable<any>{
    //console.log(userId);
    //console.log(listId);
    return this.http.get(`${this.url}/${authToken}/items-by-listId/${userId}/${listId}`); 
  }
  public createItem(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('itemName', data.itemName)
      .set('listId', data.listId)
      .set('createdBy', data.createdBy)
      .set('creatorId', data.creatorId)
      .set('type', data.type);
      
    return this.http.post(`${this.url}/${authToken}/create-item/${userId}`, params);
  }

  public editItem(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('itemId', data.itemId)
      .set('itemName', data.itemName)
      .set('listId', data.listId)
      .set('changeName', data.changeName)
      .set('changeId', data.changeId)
      .set('type', data.type);
      
    return this.http.post(`${this.url}/${authToken}/edit-item/${userId}`, params);
  }

  public deleteItem(authToken, userId, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('itemId', data.itemId)
      .set('changeBy', data.changeBy)
      .set('changeId', data.changeId)
      .set('type', data.type)
      .set('action', data.action) 
      
    return this.http.post(`${this.url}/${authToken}/delete-item/${userId}`, params);
  }
  
  public changeItemStatus(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('itemId', data.itemId);
      
    return this.http.post(`${this.url}/${authToken}/change-item-status/${userId}`, params);

  }

  public undoCreateItem(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-create-item`, params); 
  }

  public undoDeleteItem(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-delete-item`, params); 
  }

  public undoEditItem(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('refkey', data.refkey)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-edit-item`, params); 
  }
  //---------------------------------------------------------------------------
  //-----------------------------------------------------------------------
  public getSubItemsByItemId(authToken, userId, itemId):Observable<any>{
    //console.log(userId);
    //console.log(listId);
    return this.http.get(`${this.url}/${authToken}/sub-items-by-itemId/${userId}/${itemId}`); 
  }
  public createSubItem(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('subItemName', data.subItemName)
      .set('itemId', data.itemId)
      .set('createdBy', data.createdBy)
      .set('creatorId', data.creatorId)
      .set('type', data.type);
      
    return this.http.post(`${this.url}/${authToken}/create-sub-item/${userId}`, params);
  }

  public editSubItem(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('subItemId', data.subItemId)
      .set('subItemName', data.subItemName)
      .set('itemId', data.itemId)
      .set('changeName', data.changeName)
      .set('changeId', data.changeId)
      .set('type', data.type);
      
    return this.http.post(`${this.url}/${authToken}/edit-sub-item/${userId}`, params);
  }

  public deleteSubItem(authToken, userId, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('subItemId', data.subItemId)
      .set('changeBy', data.changeBy)
      .set('changeId', data.changeId)
      .set('type', data.type)
      .set('action', data.action) 
      
    return this.http.post(`${this.url}/${authToken}/delete-sub-item/${userId}`, params);
  }
  
  public changeSubItemStatus(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('subItemId', data.subItemId);
      
    return this.http.post(`${this.url}/${authToken}/change-sub-item-status/${userId}`, params);

  }

  public undoCreateSubItem(authToken, data):Observable<any>{
    console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-create-sub-item`, params); 
  }

  public undoDeleteSubItem(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-delete-sub-item`, params); 
  }

  public undoEditSubItem(authToken, data):Observable<any>{
    //console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('refkey', data.refkey)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-edit-sub-item`, params); 
  }
  //---------------------Definition of class ended----------------------------
}
