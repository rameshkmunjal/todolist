//importing angular packages
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//importing user defined services
import {UserService} from './../../user.service';
import {UtilityService} from './../../utility.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('f') loginForm:NgForm; 

  constructor(//creating instances
    private UserService:UserService,
    private utility:UtilityService,
    private router:Router
  ) { }

  ngOnInit() {}
  ngOnDestroy(){
    console.log("login component destroyed");
  }
//------------------function - to call service function - to login api call------------------
  public loginFunction():any{
   console.log("loginFunction clicked");
   
      let data={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }
    console.log(data);
      
        this.UserService.loginFunction(data).subscribe(
          apiResponse=>{
            //console.log(apiResponse);
            if(apiResponse.status===200){ //if response status 200 - move to dashboard
                
                //console.log(apiResponse);
                let userId=apiResponse.data.userDetails.userId;
                let data={
                  authToken:apiResponse.data.authToken,
                  userId:userId,
                  fullName:apiResponse.data.userDetails.firstName+" "+apiResponse.data.userDetails.lastName
                }
                  this.UserService.setUserInLocalStorage(data); 
                  //this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);                  
                  this.router.navigate(['/home' ]);
              } else { //if response status not 200 - move to error page
                //console.log(apiResponse);
                this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);              
              }          
        }, (err)=>{ // when no apiResponse
          //console.log(err);
          this.router.navigate(['/error-page', err.error.status, err.error.message]);
        }
      )    
  }


//-----------------------------class definition ended-------------------------------
}
