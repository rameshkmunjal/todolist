import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from './../../user.service';
import {SocketService} from './../../socket.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {
  //public userId:string;
 // public authToken:string;

  constructor(
    private _route:ActivatedRoute,
    private router:Router, 
    private userService:UserService,
    private SocketService:SocketService
    ) { }

  ngOnInit() {
    
    //this.userId=this._route.snapshot.paramMap.get('userId');
    //this.authToken=this.userService.getUserFromLocalStorage().authToken;
    console.log("logout component");
    //this.logoutFunction(this.userId);
  
  }
/*
  public logoutFunction(userId):any{
    console.log(userId);
    
    this.userService.logoutFunction(this.authToken, userId).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){
          console.log(apiResponse.data);
          this.userService.deleteUserFromLocalStorage();
          this.SocketService.exitSocket()
        } else {
          this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
        }        
      }, (err)=>{
          console.log(err);
          this.router.navigate(['/error-page', err.error.status, err.error.message]);
      }
    )
  }
*/
}
