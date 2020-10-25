import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Folder } from 'src/app/models/folder.model';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css'],
})
export class FolderComponent implements OnInit {
  folder: Folder;
  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.folder = data.folder;
      console.log(this.folder);
    });

    this.route.params.subscribe((params: Params) => {
      this.cloudService.currentLocation.next(params.id);
    });
  }
}
