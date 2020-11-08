import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-file-upload-loading',
  templateUrl: './file-upload-loading.component.html',
  styleUrls: ['./file-upload-loading.component.css'],
})
export class FileUploadLoadingComponent implements OnInit, OnChanges {
  @Input() files: [{ fileName: string; isUploaded: boolean }];
  @Output() closeLoader = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    console.log(this.files);
  }
  onCloseLoader() {
    setTimeout(() => {
      this.closeLoader.emit();
    }, 400);
  }
}
