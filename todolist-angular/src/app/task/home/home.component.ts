import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../user.service';
import { SocketService } from './../../socket.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public authToken:string;
  public userId:string; 
  public fullName:string;
  public userList:any=[];
  public actionWord:string;

  constructor(
    private UserService:UserService,
    private SocketService:SocketService,
    private router:Router   
  ){}

  ngOnInit(){
    this.authToken=this.UserService.getUserFromLocalStorage().authToken;
    this.userId=this.UserService.getUserFromLocalStorage().userId;
    this.fullName=this.UserService.getUserFromLocalStorage().fullName;    
  }

 public moveToHomePage(){
    let data={
      userId:this.userId,
      fullName:this.fullName
    }
    console.log(data);
    this.SocketService.sendFriendDetails(data);
 }
//------------------------------------------------------------------------ 
public getNonFriendContacts(authToken, userId, action){
  if(action==="contacts"){    
    this.UserService.getNonFriendContacts(authToken, userId).subscribe(
      apiResponse=>{
        console.log(apiResponse);
        this.userList=apiResponse.data;       
        console.log(this.userList);
        $("#contacts-modal").show();              
      },
      error=>{
        console.log(error);
        this.router.navigate(['/error-page', error.error.message, error.error.status]);
      }
    )    
  }  
}
//----------------------------------------------------------------------------------------
public closeContactsModal(){
  $("#contacts-modal").hide();
}


//-----------------------------------------------------------------------------------------
public onNavigate(feature:string){
  this.actionWord=feature;
  this.getNonFriendContacts(this.authToken, this.userId, this.actionWord);
}
//-----------------------------------Modal--------------------------------------------------------


}