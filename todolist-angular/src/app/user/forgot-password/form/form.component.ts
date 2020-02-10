//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {UserService} from './../../../user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  public email:string;
  public errorMessage:string;

  constructor(//creating instances
    private router:Router,
    private UserService:UserService
    ) { }

  ngOnInit() {}

  //function - to demand OTP - calling service function 
  public demandOTP():any{
    if(!this.email){
      this.errorMessage="E-mail field is blank";
    } else {
      console.log("email address is : "+this.email);
      this.UserService.demandOTP(this.email).subscribe(apiResponse=>{
        //console.log(apiResponse);
        if(apiResponse.status===200){//when response status OK i.e. 200
          let userId=apiResponse.data.userId;         
          this.router.navigate(['/forgot-password/otp', userId]);
        } else{//when response status is not 200 - 
          console.log(apiResponse);
          //this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
        }        
      },
      (err)=>{//when no apiResponse received - error object received
        console.log(err);
        this.router.navigate(['/error-page', err.error.status, err.error.message]);
      })      
    }    
  }
//--------------------------------class defintion ended------------------------------------
}

