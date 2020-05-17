/* This component created to display - Error Page */
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  public errorCode:string; //status code of reponse
  public errorMessage:string; //message of response


  constructor(
    private _route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.errorCode=this._route.snapshot.paramMap.get('errorCode');
    this.errorMessage=this._route.snapshot.paramMap.get('errorMessage');
  }
//end of class defintion
}
