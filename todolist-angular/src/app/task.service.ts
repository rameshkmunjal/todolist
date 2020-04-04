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

  public getNotificationList(authToken, userId):Observable<any>{
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
    console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-create-list`, params); 
  }

  public undoDeleteList(authToken, data):Observable<any>{
    console.log(data);
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('type', data.type)
      .set('notificationId', data.notificationId);

    return this.http.post(`${this.url}/${authToken}/undo-delete-list`, params); 
  }
  //---------------------Definition of class ended----------------------------
}
