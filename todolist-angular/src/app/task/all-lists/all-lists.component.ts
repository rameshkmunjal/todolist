import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-lists',
  templateUrl: './all-lists.component.html',
  styleUrls: ['./all-lists.component.css']
})
export class AllListsComponent implements OnInit {
  public pageSelected='all';
  //titles used in data-binding
  public pageallLists:string="all";
  public pageOpenLists:string="open";
  public pageDoneLists:string="done";

  constructor() { }

  ngOnInit() {
  }  

  //feature selected - got through output from child component
  onNavigate(feature:string){
    this.pageSelected=feature;       
  }
}
