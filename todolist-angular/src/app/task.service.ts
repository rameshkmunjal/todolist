import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url:string="http://localhost:3000/api/v1/todolist";

  constructor(private http:HttpClient) { }
  

  public getAllLists(authToken, userId):Observable<any>{
    console.log(`${this.url}/${authToken}/allLists/${userId}`);
    return this.http.get(`${this.url}/${authToken}/allLists/${userId}`);
  }

  public getListById(listId):Observable<any>{
    return this.http.get(`${this.url}/single-list/${listId}`);
  }

  public getAllNotifications(authToken):Observable<any>{    
    return this.http.get(`${this.url}/${authToken}/allNotifications`);
  }

  
  


  //----------------------------------------------------------------------
}
