import { Component, Input, OnInit } from '@angular/core';
import { File } from 'src/app/models/file.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  @Input() files: [File];
  constructor() {}

  ngOnInit(): void {}
}
