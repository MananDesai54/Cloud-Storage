import { Component, Input, OnInit } from '@angular/core';
import { Folder } from 'src/app/models/folder.model';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
})
export class FoldersComponent implements OnInit {
  @Input() folders: [Folder];
  constructor() {}

  ngOnInit(): void {}
}
