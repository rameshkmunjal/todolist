import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UserService} from './../user.service';


import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './forgot-password/otp/otp.component';
import { FormComponent } from './forgot-password/form/form.component';
import { ResetComponent } from './forgot-password/reset/reset.component';
import { NavComponent } from './nav/nav.component';
import { LogOutComponent } from './log-out/log-out.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'sign-up', component:SignUpComponent},
      {path:'logout/:userId', component:LogOutComponent},
      {path:'forgot-password', component:ForgotPasswordComponent, children:[
        {path:'form', component:FormComponent},
        {path:'otp/:userId', component:OtpComponent},
        {path:'reset/:code', component:ResetComponent},
        {path:'', redirectTo:'form', pathMatch:'full'}        
      ]}
    ])
  ],
  declarations: [    
    SignUpComponent, 
    ForgotPasswordComponent, 
    OtpComponent, 
    FormComponent, 
    ResetComponent, 
    NavComponent, LogOutComponent
  ],
  providers:[UserService]
})
export class UserModule { }
