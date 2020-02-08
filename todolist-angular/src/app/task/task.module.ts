import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';

import { FriendListComponent } from './friend-list/friend-list.component';
import { TaskNavComponent } from './task-nav/task-nav.component';
import { FriendPageComponent } from './friend-page/friend-page.component';
import { ListComponent } from './list/list.component';
import { ItemsComponent } from './items/items.component';
import { SubItemsComponent } from './sub-items/sub-items.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'home', component:HomeComponent},      
      {path:'friend-page/:friendId', component:FriendPageComponent },
      
      {path:'notifications', component:NotificationsComponent }
    ])
  ],
  declarations: [
    HomeComponent, 
    FriendListComponent, 
    TaskNavComponent, 
    FriendPageComponent, 
    ListComponent, 
    ItemsComponent, 
    SubItemsComponent, 
    NotificationsComponent
  ]
})
export class TaskModule { }
