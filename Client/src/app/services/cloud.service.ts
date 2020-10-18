import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CloudService {
  isNavOpen = false;
  navToggle = new Subject();

  toggleNavOpen() {
    this.isNavOpen = !this.isNavOpen;
    this.navToggle.next(this.isNavOpen);
  }
}
