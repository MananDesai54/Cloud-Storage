import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  showSplashScreen = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

  ngDoCheck() {
    // console.log(this.showSplashScreen);
  }
  onCompleteSplashScreen() {
    // console.log(event);
    this.showSplashScreen = false;
  }
}
