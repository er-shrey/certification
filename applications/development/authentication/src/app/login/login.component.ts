import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
    public apiCall: ApiCallService,
    public _snackBar: MatSnackBar
  ) { }

  signin = true;
  loginUserName = "";
  loginPassword = "";
  loginBtnDisable = false;

  quotes = [
    "Push yourself, because no one else is going to do it for you",
    "There is no substitute for hard work",
    "To acquire knowledge, one must study",
    "You can't study the darkness by flooding it with light",
    "The ink of the scholar is more holy than the blood of the martyr",
    "It's not what you do but that kind of job you do that makes the difference",
    "It always seems impossible, until it is done"
  ];
  randomQuote = "It's not what you do but that kind of job you do that makes the difference";

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: false
    });
    this.genRandomQuote();
  }
  
  formType(val){
    this.signin = val;
    this.genRandomQuote();
  }

  genRandomQuote(){
    this.randomQuote =  this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  forgotPass(){
    this.router.navigate(['forgotPass']);
  }

  signIn(){
    this.loginBtnDisable = true;
    var param = {
      "username"  : this.loginUserName,
      "password"  : this.b64EncodeUnicode(this.loginPassword)
    };
    this.apiCall.postRequest('/login/loginValidate',param).subscribe(data => {
      this.loginBtnDisable = false;
      if(data["status"]=="ERROR"){       
        this.openSnackBar(data['error']);
      }else if(data["status"] == "SUCCESS"){
        sessionStorage.setItem("appToken",data["token"]);
        window.location.href = data['pageUrl'];
      }else if(data["status"]=="FAILED"){
        this.openSnackBar(data['message']);
      }
    });
  }
  
  b64EncodeUnicode(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
			function toSolidBytes(match, p1) {
        var temp:string = String.fromCharCode(+('0x' + p1));
				return temp;
		}));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass:['errorMessage'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }s
}
