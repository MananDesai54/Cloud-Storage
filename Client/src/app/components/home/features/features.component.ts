import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent implements OnInit {
  @ViewChild('cards', { static: true }) cards: ElementRef;
  constructor() {}

  ngOnInit(): void {
    const cardData = [...this.cards.nativeElement.children];

    const intersection = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'feature-animation') {
            if (entry.isIntersecting) {
              entry.target.classList.add('animation');
            } else {
              entry.target.classList.remove('animation');
            }
          } else if (entry.target.id.includes('card__data')) {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
              intersection.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-100px',
      }
    );

    cardData.forEach((card) => {
      intersection.observe(card);
    });
  }
}
