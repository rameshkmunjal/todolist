//importing packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
//importing services
import {UserService} from './../../user.service';
import {UtilityService} from './../../utility.service';
import {CountryCodeService} from './../../country-code.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  //variables to hold values - sign up form 
  public firstName:string;
  public lastName:string;
  public email:string;
  public password:string;
  public mobile:string;
  public country:String="India"; //default
  public countryCode:string="91";//default

  public countryCodeList:any=[];//to hold country codes , names etc
  //variable to show error messages
  public errorMessage:string;//to show error message
  public errorObj:any={}; //to hold result of vaidation of inputs


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
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      password:this.password,      
      country:this.country,
      countryCode:this.countryCode,
      mobile:this.mobile
    }
    console.log(data);
   //validate inputs 
    this.errorObj=this.utility.validateInput(data);
    //if all input values are filled up
    if(!this.errorObj.flag){
      //make a function call - for api call    
      this.UserService.signupFunction(data).subscribe(
        apiResponse=>{
          if(apiResponse.status===200){
            this.errorMessage="";
            console.log(apiResponse);
            this.toastr.success(apiResponse.message);
            this.router.navigate(['/login']);
          } else { 
              console.log(apiResponse);             
              this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
          }            
        }, (err)=>{
            console.log(err);            
            this.router.navigate(['/error-page', err.error.status, err.error.message]);
          }
        )
      }  else {//if all values are not input
        this.errorMessage=this.errorObj.message;
      }
  }
  //----------------------------------------------------------------------------------
  //to get list from country code service
  public sendCountryObjects=()=>{
    this.countryCodeList=this.CountryCodeService.sendCountryObjects();
    //console.log(this.countryCodeList);
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
      this.errorMessage="You should select country name first";
    }    
  }  
//----------------------------------------------------------------------------------------
//-------------------------------------End of Class Definition-------------------------------------
}
