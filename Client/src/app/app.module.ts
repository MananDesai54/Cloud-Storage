import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CloudComponent } from './Components/cloud/cloud.component';
import { SplashScreenComponent } from './Components/splash-screen/splash-screen.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AppRouterModule } from './app-router.module';
import { AuthOptionsComponent } from './Components/home/auth-options/auth-options.component';
import { IntroComponent } from './Components/home/intro/intro.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    CloudComponent,
    SplashScreenComponent,
    NavbarComponent,
    AuthOptionsComponent,
    IntroComponent,
  ],
  imports: [
    BrowserModule,
    AppRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
