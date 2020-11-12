import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('menuToggle') menuToggle: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('addMenu') addMenu: ElementRef;
  location: string;
  folderNameForm: FormGroup;
  isLoading: boolean;
  isCreateFolder = false;
  message: string;
  filesToUpload = [];
  user: User;
  userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    this.cloudService.currentLocation.subscribe((location) => {
      this.location = location;
    });

    this.folderNameForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

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
    [...files].forEach((file) => {
      this.filesToUpload.push({ fileName: file.name, isUploaded: false });
    });
    [...files].forEach((file, index) => {
      this.cloudService.uploadFile(file, this.location).subscribe(
        (res) => {
          const updatedData = [...this.filesToUpload];
          updatedData[index].isUploaded = true;
          this.filesToUpload = [...updatedData];
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
  onCreateFolder() {
    this.isLoading = true;
    this.cloudService
      .createFolder(this.folderNameForm.value.name, this.location || 'root')
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.isCreateFolder = false;
          this.folderNameForm.reset();
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
          this.setMessage(error);
        }
      );
  }

  private setMessage(message) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
