import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lists-header',
  templateUrl: './lists-header.component.html',
  styleUrls: ['./lists-header.component.css']
})
export class ListsHeaderComponent implements OnInit {
  //send feature selected to parent component i.e. meeting-list
  @Output() listSelected = new EventEmitter<string>();
  public isAll:boolean=true;
  public isOpen:boolean=false;
  public isDone:boolean=false; 

  constructor() { }

  ngOnInit() {
  }

  
   
  //function  to get feature from click of button
  showLists(feature:string){
    console.log(feature); 
    if(feature=='all'){
      this.isAll=true;
      this.isOpen=false;
      this.isDone=false;
    } else if(feature=='open'){
      this.isAll=false;
      this.isOpen=true;
      this.isDone=false;      
    }else if(feature=='done'){
      this.isAll=false;
      this.isOpen=false;
      this.isDone=true;      
    }
    this.listSelected.emit(feature);
  }


}
