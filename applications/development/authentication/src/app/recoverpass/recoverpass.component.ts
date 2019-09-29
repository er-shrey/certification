import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.component.html',
  styleUrls: ['./recoverpass.component.css']
})
export class RecoverpassComponent implements OnInit {

  message = '';
  disableResetBtn = false;

  constructor(
    public router: Router,
    public apiCall: ApiCallService
  ) { }

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: false
    });
  }

  signin(){
    this.router.navigate(['home']);
  }

  resetPass(password){
    this.disableResetBtn = true;
    var param = {
      "password": this.b64EncodeUnicode(password),
      "token": "hello",
      "username":"shrey"
    };
    this.apiCall.postRequest('/login/resetPassword',param).subscribe(data => {
      this.disableResetBtn = false;
      this.message = data['message'];
    });
  }

  b64EncodeUnicode(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
			function toSolidBytes(match, p1) {
        var temp:string = String.fromCharCode(+('0x' + p1));
				return temp;
		}));
  }
}
