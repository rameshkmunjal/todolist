import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from'@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url:string='http://localhost:3000/api/v1/todolist';

  constructor(//creating instances
    private http:HttpClient
  ) { }
//-----------------------------------------------------------------------------------
  //functions to set user info in local storage
  public setUserInLocalStorage(data){
    localStorage.setItem('userDetails', JSON.stringify(data));
  }
  //function to get user info in local storage
  public getUserFromLocalStorage(){
    return JSON.parse(localStorage.getItem('userDetails'));
  } 
  public deleteUserFromLocalStorage(){
    localStorage.removeItem('userDetails');
  }
//-----------------------------------------------------------------------------------
//function - to make api call to sign up
  public signupFunction(data):Observable<any>{
    console.log(data);
    let params=new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("email", data.email)
      .set("password", data.password)
      .set("country", data.country)
      .set("countryCode", data.countryCode)
      .set("mobile", data.mobile);
      console.log(params);
    return this.http.post(`${this.url}/sign-up`, params);
  }
//function - to make api call for login
  public loginFunction(data):Observable<any>{
    let params=new HttpParams()
      .set("email", data.email)
      .set("password", data.password);
      console.log(params);
    return this.http.post(`${this.url}/login`, params);
  }
//function - api call to ask for OTP - to reset password
  public demandOTP(email):Observable<any>{
      return this.http.get(`${this.url}/demandOTP/${email}`);
  }

//function - api call to match OTP 
public matchOTP(userId, otp):Observable<any>{
  let params=new HttpParams()
    .set("otp", otp);
  return this.http.post(`${this.url}/matchOTP/${userId}`, params);
}
//function - api call to reset password
  public resetPassword(email, password, code):Observable<any>{
      let params=new HttpParams()
        .set('password', password);
      return this.http.post(`${this.url}/resetPassword/${email}/${code}`, params);
  }
//-----------------------------------------------------------------------------------
//function - to get list of all users
  public getFriendList(authToken, userId):Observable<any>{
      return this.http.get(`${this.url}/${authToken}/getfriendlist/${userId}`);
  }
  
 //function - to get list of users - those are not friends 
  public getContactList(authToken, userId):Observable<any>{
      return this.http.get(`${this.url}/${authToken}/contacts/${userId}`);
  }

  public includeAContactInFriendList(authToken, userId, data):Observable<any>{
    let params=new HttpParams()
      .set('userId', data.userId)
      .set('userName', data.userName)
      .set('friendId', data.friendId)
      .set('friendName', data.friendName)
    return this.http.post(`${this.url}/${authToken}/acceptFriend/${userId}`, params);
  }
  //-----------------------------------------------------------------------------------
//function - to logout
  public logoutFunction(authToken, userId):Observable<any>{
    console.log(userId);
    let params=new HttpParams()
      .set("userId", userId);
    return this.http.post(`${this.url}/${authToken}/logout`, params);
  }
  //--------------------end of class definition--------------------------------------
}
