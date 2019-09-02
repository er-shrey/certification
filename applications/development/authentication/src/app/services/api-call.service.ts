import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(
	  private _http: HttpClient
  ){ }
  
	getRequest(url: string, param? : object){
    if(param){
      return this._http.get(url,param)
    }else{
      return this._http.get(url)
    }    
  }
  
  postRequest(url: string, param? : object){
    if(param){
      return this._http.post(url,param)
    }else{
      return this._http.post(url,{})
    }    
  }
}
