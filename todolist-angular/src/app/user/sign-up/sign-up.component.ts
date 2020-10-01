//importing packages
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
//importing services
import {UserService} from './../../user.service';
import {UtilityService} from './../../utility.service';
import {CountryCodeService} from './../../country-code.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild('f') signupForm:NgForm;
  public message:String;
  //variables to hold values - sign up form 
  
  public mobile:Number;
  public country:String="India"; //default
  public countryCode:string="91";//default

  public countryCodeList:any=[];//to hold country codes , names etc

  constructor(
    //creating instance - services
    private UserService:UserService,
    private CountryCodeService:CountryCodeService,
    private utility:UtilityService,
    //others
    private router:Router,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    //lifecycle hook when component is created
    this.sendCountryObjects();
  }

  ngOnDestroy() {//lifecycle hook when component destroyed
    console.log("Sign up component destroyed");
  }
//-------------------------------class functions--------------------------------------
//signupFunction to accept form values and make a service function call
  public signupFunction():any{
    //created a object - data - inputs made in form    
    let data={
      firstName:this.signupForm.value.firstName,
      lastName:this.signupForm.value.lastName,
      email:this.signupForm.value.email,
      password:this.signupForm.value.password,      
      country:this.country,
      countryCode:this.countryCode,
      mobile:this.mobile
    }
    console.log(data);
   
      //make a function call - for api call    
      this.UserService.signupFunction(data).subscribe(
        apiResponse=>{
          if(apiResponse.status===200){
            
            //console.log(apiResponse);
            this.toastr.success(apiResponse.message);
            this.signupForm=null;
            this.router.navigate(['/login']);
          } else { 
              //console.log(apiResponse);             
              this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
          }            
        }, (err)=>{
            //console.log(err);            
            this.router.navigate(['/error-page', err.error.status, err.error.message]);
          }
        )
      
  }
  //----------------------------------------------------------------------------------
  //to get list from country code service
  public sendCountryObjects=()=>{
    this.countryCodeList=this.CountryCodeService.sendCountryObjects();
    console.log(this.countryCodeList);
  }
//Only when country name is selected - assign country code
  public getCountryCode=()=>{
    if(this.country){
      for(let obj of this.countryCodeList){
        if(obj.name==this.country){
          this.countryCode=obj.digit;
        }
      }
    } else {
      //this.errorMessage="You should select country name first";
      console.log("You should select country name first ")
    }    
  }  
//----------------------------------------------------------------------------------------
//-------------------------------------End of Class Definition-------------------------------------
}
