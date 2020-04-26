//import angular/npm  packages/modules
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from "ngx-toastr";
import {UserModule} from './user/user.module';
import {TaskModule} from './task/task.module';

//import components
import { AppComponent } from './app.component';
import {LoginComponent } from './user/login/login.component';
import { ErrorPageComponent } from './error-page/error-page.component';
//import services
import { UserService } from './user.service';


@NgModule({
  declarations: [//including components of pages to be shown 
    AppComponent,    
    LoginComponent, 
    ErrorPageComponent
  ],
  imports: [ //including modules 
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({}),
    UserModule,
    TaskModule,
    
    RouterModule.forRoot([
      {path:'login', component:LoginComponent},
      {path:'error-page/:errorCode/:errorMessage', component:ErrorPageComponent},
      {path:'', redirectTo:'login', pathMatch:'full'},
      {path:'**', component:LoginComponent}
    ])
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
