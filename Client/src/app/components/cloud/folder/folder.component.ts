import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from 'src/app/models/folder.model';
import { CloudService, STATUS } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css'],
})
export class FolderComponent implements OnInit {
  folder: Folder;
  folderCreated: Subscription;
  id: string;
  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.folder = data.folder;
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.cloudService.currentLocation.next(params.id);
    });

    this.folderCreated = this.cloudService.folderAction.subscribe(
      (res) => {
        if (res.status === STATUS.CREATED) {
          this.folder = res.parent;
        } else if (res.status === STATUS.DELETED) {
          // this.folder = res.parent;
          console.log(this.folder);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
