import { Component, Input, OnInit } from '@angular/core';
import { File } from 'src/app/models/file.model';
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
export class FilesComponent implements OnInit {
  @Input() files: [File];
  fileType: IFileType[] = fileTypes;
  constructor() {}

  ngOnInit(): void {}

  checkFileType(file) {
    const fileType = this.fileType.find((kind) =>
      kind.type.includes(file.fileType)
    );
    return fileType.icon;
  }
}
