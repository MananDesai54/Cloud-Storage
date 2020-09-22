import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  showSplashScreen = true;

  ngDoCheck() {
    // console.log(this.showSplashScreen);
  }
  onCompleteSplashScreen() {
    // console.log(event);
    this.showSplashScreen = false;
  }
}
