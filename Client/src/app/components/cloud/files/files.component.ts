import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { File } from 'src/app/models/file.model';
import { CloudService, STATUS } from 'src/app/services/cloud.service';
import { fileTypes } from './fileTypes';

interface IFileType {
  type: string[];
  icon: string;
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() files: File[];
  @Input() location: string;
  @ViewChild('editOption') editOption: ElementRef;
  fileType: IFileType[] = fileTypes;
  locationSubscription: Subscription;
  fileActionSubscription: Subscription;
  renameSubscription: Subscription;
  deleteSubscription: Subscription;
  selectedEditFile: any;
  renameForm: FormGroup;
  isRename: boolean;
  message: string;
  isLoading: boolean;

  constructor(private cloudService: CloudService) {}

  ngOnInit(): void {
    this.locationSubscription = this.cloudService.currentLocation.subscribe(
      (location) => {
        this.location = location;
      }
    );
    this.files = this.files.filter((file) => {
      return file.location === this.location;
    });
    this.renameForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.fileActionSubscription = this.cloudService.fileAction.subscribe(
      (res) => {
        if (res.status === STATUS.EDITED) {
          this.files = this.files.map((file: any) => {
            if (file._id === res.file.id) {
              file = res.file;
              file._id = file.id;
            }
            return file;
          });
        } else if (res.status === STATUS.DELETED) {
          this.files = this.files.filter(
            (file: any) => file._id !== res.file.id
          );
        }
      }
    );
  }

  ngOnChanges() {
    this.files = this.files.filter((file) => {
      return file.location === this.location;
    });
  }

  onOpenFileSettings(file: any) {
    this.selectedEditFile = file;
    this.editOption.nativeElement.classList.toggle('open');
  }
  checkFileType(file) {
    const fileType = this.fileType.find((kind) =>
      kind.type.includes(file.fileType)
    );
    return fileType.icon;
  }
  onRename() {
    console.log(this.renameForm.value.name, this.selectedEditFile._id);
    this.isLoading = true;
    this.renameSubscription = this.cloudService
      .editFile({
        name: `${this.renameForm.value.name}.${this.selectedEditFile.fileType}`,
        id: this.selectedEditFile._id,
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
      .deleteFile(this.selectedEditFile._id)
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
    this.locationSubscription?.unsubscribe();
    this.fileActionSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.renameSubscription?.unsubscribe();
  }
}
