//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
//import user-defined services
import {UserService} from './../../../user.service';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit { 
  //variables to hold form inputs 
  public email:string;
  public newPassword:string;
  public confirmPassword:string;
  
  public errorMessage:string;//to show error
  public userDetails:any;//user details

  public code:string;
  

  constructor(//creating instances
    private UserService:UserService,
    private router:Router,
    private _route:ActivatedRoute
  ) { }

  ngOnInit() {     
    this.code=this._route.snapshot.paramMap.get('code');
    //console.log(this.code);
  }
//-----------------function to reset password-----------------------------
  public resetPassword():void{    
    if(!this.email){
      this.errorMessage="Enter email address";
    } else if(!this.newPassword){
      this.errorMessage="Enter new password";
    } else if(!this.confirmPassword){
      this.errorMessage="Enter confirm password"
    } else if(this.newPassword !== this.confirmPassword){
      this.errorMessage="New Password does not match with confirm password"
    }else {
      this.errorMessage="";
      
      this.UserService.resetPassword(this.email, this.newPassword,   this.code).subscribe(
        apiResponse=>{
          //console.log(apiResponse);
          if(apiResponse.status===200){//when response status is  200 
            this.router.navigate(['/login']);
          }else{//when response status is not 200 
            this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
          }           
        }, (err)=>{//when no apiResponse is recd
          console.log(err);
          this.router.navigate(['/error-page', err.error.status, err.error.message]);
        }
      )
    }
  }
//---------------------end of class definition------------------------------
}

