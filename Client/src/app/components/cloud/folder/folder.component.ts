import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from 'src/app/models/folder.model';
import { CloudService, STATUS } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css'],
})
export class FolderComponent implements OnInit, OnDestroy {
  folder: Folder;
  folderCreated: Subscription;
  fileCreated: Subscription;
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
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.fileCreated = this.cloudService.fileAction.subscribe(
      (res) => {
        if (res.status === STATUS.CREATED) {
          this.folder = res.parent;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.fileCreated?.unsubscribe();
    this.folderCreated?.unsubscribe();
  }
}
