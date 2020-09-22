import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const timeline = gsap.timeline({
      defaults:{
          duration:0.5,
      }
    });
    
    timeline
        .from('.intro__data',{
            opacity:0,
            stagger:0.2
        },'+1')
        .from('.forms',{
            opacity:0
        })
        // .from('.what-can-you-do',{
        //     opacity:0
        // })
        // .from('.cards__info',{
        //     opacity:0
        // })
        // .from('.how-to-use',{
        //     opacity:0
        // })
        // .from('footer',{
        //     opacity:0
        // })
  }

}
