import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  public errorCode:string;
  public errorMessage:string;


  constructor(
    private _route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.errorCode=this._route.snapshot.paramMap.get('errorCode');
    this.errorMessage=this._route.snapshot.paramMap.get('errorMessage');
  }

}
