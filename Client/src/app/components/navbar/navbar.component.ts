import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  @ViewChild('menuToggle') menuToggle: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('addMenu') addMenu: ElementRef;

  constructor(
    private authService: AuthService,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {}

  onMenuToggle() {
    this.menuToggle.nativeElement.classList.toggle('toggle-move');
    this.menu.nativeElement.classList.toggle('menu-move');
    this.addMenu.nativeElement.classList.remove('open');
    this.cloudService.toggleNavOpen();
  }
  onOpenUploadOption() {
    this.addMenu.nativeElement.classList.toggle('open');
  }
  onFileUpload(files: any) {
    console.log(files);
  }

  onLogout() {
    this.authService.logout();
  }
}
