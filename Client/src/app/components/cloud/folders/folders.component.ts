import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class FoldersComponent implements OnInit {
  @Input() folders: Folder[];
  @Input() location: string;
  @ViewChild('editOption') editOption: ElementRef;
  folderCreated: Subscription;
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
    this.folders = this.folders.filter(
      (folder) => folder.location === this.location
    );
    this.folderCreated = this.cloudService.folderAction.subscribe(
      (res) => {
        if (res.status === STATUS.CREATED) {
          this.folders.push(res.folder);
          console.log(this.folders);
        } else if (res.status === STATUS.EDITED) {
          this.folders = this.folders.map((folder: any) => {
            if (folder._id === res.folder.id) {
              folder = res.folder;
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

  onOpenFolderSettings(folder: Folder) {
    this.selectedEditFolder = folder;
    this.editOption.nativeElement.classList.toggle('open');
  }
  onRename() {
    console.log(this.renameForm.value.name, this.selectedEditFolder._id);
    this.isLoading = true;
    this.cloudService
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
    this.cloudService.deleteFolder(this.selectedEditFolder._id).subscribe(
      (res) => {
        console.log(res);
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
}
