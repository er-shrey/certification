import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public router: Router
  ) { }

  signin = true;

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
}
