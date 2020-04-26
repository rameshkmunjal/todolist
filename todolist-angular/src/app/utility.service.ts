import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }
  //-----------------------------------------------------------------------------------------
  //function - to validate a string variable holds value or not
  public checkIfEmpty(propValue){    
    if(propValue===undefined || propValue===null || propValue===''){
      return true;
    } else{
      return false;
    }
  }

//------------------------------------------------------------------------------------------- 
//function - to validate sign up input form
  public validateInput(data){      
    if(this.checkIfEmpty(data.firstName)){
      return {flag:true, message:"firstName field is empty"};
    } else if(this.checkIfEmpty(data.lastName)){
      return {flag:true, message:"lastName field is empty"};
    } else if(this.checkIfEmpty(data.email)){
      return {flag:true, message:"email field is empty"};
    } else if(this.checkIfEmpty(data.password)){
      return {flag:true, message:"password field is empty"};
    } else if(this.checkIfEmpty(data.country)){
      return {flag:true, message:"country field is empty"};
    }else if(this.checkIfEmpty(data.countryCode)){
      return {flag:true, message:"country code field is empty"};
    }else if(this.checkIfEmpty(data.mobile)){
      return {flag:true, message:"mobile field is empty"};
    } else {
      return {flag:false, message:"input values are valid "}
    }   
  }
  //----------------------------------------------------------------------------- 
  //function - to validate login input form values
  public validateLoginInputs(data){      
    if(this.checkIfEmpty(data.email)){
      return {flag:true, message:"email field is empty"};
    } else if(this.checkIfEmpty(data.password)){
      return {flag:true, message:"password field is empty"};
    }  else {
      return {flag:false, message:"input values are valid "}
    }   
  }
  //---------------------------End Of Class Definition---------------------------------------
  /*
  public arrangeListsByDescendingOrder(list):any{
    list.sort(function(a, b):any{          
      if(new Date(a.createdOn) < new Date(b.createdOn)){
        return 1;
      } else if(new Date(a.createdOn)  > new Date(b.createdOn)){
        return -1;
      } else {
        return 0;
      }      
    });
    return list;
  }
*/
  //function - sorting meetings in descending order
  public arrangeListsByDescendingOrder(list){
    list.sort(function(a, b):any{          
      if(new Date(a.createdOn) < new Date(b.createdOn)){
        return 1;
      } else if(new Date(a.createdOn)  > new Date(b.createdOn)){
        return -1;
      } else {
        return 0;
      }      
    });
    return list;
  }
  //------------------------------------------------------------------------------------------
}
