import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from 'src/app/models/folder.model';
import { CloudService, STATUS } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
})
export class FoldersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() folders: Folder[];
  @Input() location: string;
  @ViewChild('editOption') editOption: ElementRef;
  folderCreated: Subscription;
  locationSubscription: Subscription;
  renameSubscription: Subscription;
  deleteSubscription: Subscription;
  selectedEditFolder: any;
  renameForm: FormGroup;
  isRename: boolean;
  message: string;
  isLoading: boolean;
  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    console.log(this.folders);
    this.locationSubscription = this.cloudService.currentLocation.subscribe(
      (location) => {
        this.location = location;
      }
    );
    this.folders = this.folders.filter(
      (folder) => folder.location === this.location
    );
    this.folderCreated = this.cloudService.folderAction.subscribe(
      (res) => {
        if (res.status === STATUS.CREATED) {
          // this.folders.push(res.folder);
        } else if (res.status === STATUS.EDITED) {
          this.folders = this.folders.map((folder: any) => {
            if (folder._id === res.folder.id) {
              folder = res.folder;
              folder._id = folder.id;
            }
            return folder;
          });
        } else if (res.status === STATUS.DELETED) {
          this.folders = this.folders.filter(
            (folder: any) => folder._id !== res.folder.id
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.renameForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  ngOnChanges() {
    this.folders = this.folders.filter((folder) => {
      return folder.location === this.location;
    });
  }

  onOpenFolderSettings(folder: Folder) {
    this.selectedEditFolder = folder;
    this.editOption.nativeElement.classList.toggle('open');
  }
  onRename() {
    console.log(this.renameForm.value.name, this.selectedEditFolder._id);
    this.isLoading = true;
    this.renameSubscription = this.cloudService
      .editFolder({
        name: this.renameForm.value.name,
        id: this.selectedEditFolder._id,
      })
      .subscribe(
        (res) => {
          this.reset();
          console.log(res);
        },
        (error) => {
          this.reset();
          console.log(error);
        }
      );
  }

  onDeleteFolder() {
    this.deleteSubscription = this.cloudService
      .deleteFolder(this.selectedEditFolder._id)
      .subscribe(
        (res) => {
          console.log('Folder deleted');
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private reset() {
    this.isLoading = false;
    this.isRename = false;
    this.renameForm.reset();
  }

  ngOnDestroy() {
    this.folderCreated?.unsubscribe();
    this.locationSubscription?.unsubscribe();
    this.renameSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }
}
