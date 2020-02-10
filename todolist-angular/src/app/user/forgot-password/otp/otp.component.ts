//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
//import user defined services
import {UserService} from './../../../user.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})

export class OtpComponent implements OnInit {
  public userId:string;
  public otp:string;//to hold otp
  public code:string;//a param to hold otp-mode string in case of otp input && encrypted code in case of link
  public mode:string;//otp or link
  public errorMessage:string="";//to hold error message

  constructor(//creating instances
    private router:Router,
    private _route:ActivatedRoute,
    private userService:UserService
  ) { }

  ngOnInit() {
    this.userId=this._route.snapshot.paramMap.get('userId');
    this.mode="otp";
    console.log(this.userId);
  }
//function to send OTP - service function
  public submitOTP():any{
    if(!this.otp){
      this.errorMessage="Enter OTP";
    } else {
      this.userService.matchOTP(this.userId, this.otp).subscribe(
        apiResponse=>{          
          console.log(apiResponse);
          if(apiResponse.status===200){ 
            this.code=apiResponse.data.emailDecryptLink;                      
            this.router.navigate(['/forgot-password/reset', this.code]);
          } else {
            this.router.navigate(['/error-page', apiResponse.status, apiResponse.message]);
          } 
        }, (err)=>{
          console.log(err);
          this.router.navigate(['/error-page', err.error.status, err.error.message]);
        }
      )      
    }    
  }

}

