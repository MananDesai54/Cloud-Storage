import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  @ViewChild('menuToggle') menuToggle: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onMenuToggle() {
    this.menuToggle.nativeElement.classList.toggle('toggle-move');
    this.menu.nativeElement.classList.toggle('menu-move');
  }

  onLogout() {
    this.authService.logout();
  }
}
