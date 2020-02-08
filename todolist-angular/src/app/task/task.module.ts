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
import { AllListsComponent } from './all-lists/all-lists.component';
import { ListsHeaderComponent } from './all-lists/lists-header/lists-header.component';
import { OpenListsComponent } from './all-lists/open-lists/open-lists.component';
import { DoneListsComponent } from './all-lists/done-lists/done-lists.component';
import { ListsComponent } from './all-lists/lists/lists.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'home', component:HomeComponent},      
      {path:'friend-page/:friendId', component:FriendPageComponent },
      {path:'lists', component:AllListsComponent },
      {path:'notifications', component:NotificationsComponent }
    ])
  ],
  declarations: [HomeComponent, FriendListComponent, TaskNavComponent, FriendPageComponent, ListComponent, ItemsComponent, SubItemsComponent, NotificationsComponent, AllListsComponent, ListsHeaderComponent, OpenListsComponent, DoneListsComponent, ListsComponent]
})
export class TaskModule { }
