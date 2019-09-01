import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RecoverpassComponent } from './recoverpass/recoverpass.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';

const appRoutes:Routes = [
  { path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home',
    component: LoginComponent
  },
  { path: 'resetPass',
    component: RecoverpassComponent
  },
  { path: 'forgotPass',
    component: ForgotpassComponent
  },
  { path: '**',
    redirectTo: 'home',
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverpassComponent,
    AppFooterComponent,
    ForgotpassComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    HttpModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
