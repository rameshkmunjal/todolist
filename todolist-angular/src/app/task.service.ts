import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url:string="http://localhost:3000/api/v1/todolist";

  constructor(private http:HttpClient) { }
  //createTask(data)
  public createTask(data):Observable<any>{
    let params=new HttpParams()
      .set('project', data.project)
      .set('taskName', data.taskName)
      .set('startDate', data.startDate)
      .set('completionDate', data.completionDate)
      .set('priority', data.priority)
      .set('assignee', data.assignee);

    return this.http.post(`${this.url}/create`, params);
    //return this.http.post(`${this.url}/sign-up`, params)
  }

  public getAllLists(authToken, userId):Observable<any>{
    console.log(`${this.url}/${authToken}/allLists/${userId}`);
    return this.http.get(`${this.url}/${authToken}/allLists/${userId}`);
  }

  public getListById(listId):Observable<any>{
    return this.http.get(`${this.url}/single-list/${listId}`);
  }

  public editTask(currentTask, taskId):Observable<any>{
    let data=new HttpParams()
      .set('projectId', currentTask.projectId)
      .set('taskName', currentTask.taskName )
      .set('startDate', currentTask.startDate)
      .set('endDate', currentTask.endDate)
      .set('priority', currentTask.priority)
      .set('assignee', currentTask.assignee)
    return this.http.put(`${this.url}/editTask/${taskId}`, data)
  }
  public deleteTask(id):Observable<any>{
    let params=new HttpParams()
      .set('taskId', id);
    return this.http.post(`${this.url}/deleteTask`, params)
  }


  //---------------------------------------------------------------------
}
