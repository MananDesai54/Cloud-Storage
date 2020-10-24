import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { env } from '../environments/env';

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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { AuthInterceptorService } from './components/auth/auth-interceptor.service';
import { AuthGuard } from './components/auth/auth.guard';
import { UserResolver } from './components/cloud/user-resolver.service';
import { ProfileComponent } from './components/cloud/profile/profile.component';
import { CloudService } from './services/cloud.service';
import { RootComponent } from './components/cloud/root/root.component';
import { ModalComponent } from './components/modal/modal.component';
import { ProfileService } from './services/profile.service';
import { CloudResolver } from './components/cloud/cloud.resolver';

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
    MessageBoxComponent,
    ProfileComponent,
    RootComponent,
    ModalComponent,
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
            provider: new GoogleLoginProvider(env.GOOGLE_OAUTH_CLIENT_ID),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(env.FACEBOOK_OAUTH_CLIENT_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AuthService,
    AuthGuard,
    UserResolver,
    CloudService,
    ProfileService,
    CloudResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
