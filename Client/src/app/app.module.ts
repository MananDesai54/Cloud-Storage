import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { GOOGLE_OAUTH_CLIENT_ID, FACEBOOK_OAUTH_CLIENT_ID } from './secrets';

import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';
import { CloudComponent } from './Components/cloud/cloud.component';
import { SplashScreenComponent } from './Components/splash-screen/splash-screen.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AppRouterModule } from './app-router.module';
import { AuthOptionsComponent } from './Components/home/auth-options/auth-options.component';
import { IntroComponent } from './Components/home/intro/intro.component';
import { FeaturesComponent } from './Components/home/features/features.component';
import { FooterComponent } from './Components/home/footer/footer.component';
import { WrapUpComponent } from './Components/home/wrap-up/wrap-up.component';
import { SocialButtonComponent } from './components/auth/socialButtons/social-button.component';

import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { ErrorBoxComponent } from './error-box/error-box.component';

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
    FeaturesComponent,
    FooterComponent,
    WrapUpComponent,
    SocialButtonComponent,
    NotFoundComponent,
    LoaderComponent,
    ErrorBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(GOOGLE_OAUTH_CLIENT_ID),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(FACEBOOK_OAUTH_CLIENT_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
