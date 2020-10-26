import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from 'src/app/models/folder.model';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
})
export class FoldersComponent implements OnInit {
  @Input() folders: Folder[];
  @Input() location: string;
  folderCreated: Subscription;
  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    this.folders = this.folders.filter(
      (folder) => folder.location === this.location
    );
    this.folderCreated = this.cloudService.folderCreated.subscribe(
      (folder) => {
        this.folders.push(folder);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
