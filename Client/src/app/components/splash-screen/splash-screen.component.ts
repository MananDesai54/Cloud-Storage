import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;
  @Output() completeSplashScreen = new EventEmitter<string>();
  constructor() {
    setTimeout(() => {
      this.completeSplashScreen.emit();
    }, 4000);
  }

  ngOnInit(): void {
    const timeline = gsap.timeline();
    timeline
      .to('.splash-screen', {
        duration: 0.5,
        opacity: 0,
        delay: 4,
      })
      .to('.splash-screen', {
        zIndex: -100,
      })
      .then(() => {
        // console.log('hello');
        // this.completeSplashScreen.emit();
      });
  }
  ngOnDestroy() {
    // console.log('destroy');
  }
}
