import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { ApiCallService } from '../services/api-call.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {
  constructor(
    public router: Router,
    public apiCall: ApiCallService,
    public _snackBar: MatSnackBar
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

  forgotPass(email){
    var param = {
      "email"  : email
    };
    this.apiCall.postRequest('/login/forgotPassword',param).subscribe(data => {
      this.openSnackBar(data['message']);
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass:['errorMessage'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}
