import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  showSplashScreen = true;

  onCompleteSplashScreen() {
    console.log('Hello');
    this.showSplashScreen = false;
  }
  ngDoCheck() {
    console.log(this.showSplashScreen);
  }
}
