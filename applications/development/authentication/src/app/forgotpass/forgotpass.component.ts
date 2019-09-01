import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {
  constructor(
    public router: Router
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
}
