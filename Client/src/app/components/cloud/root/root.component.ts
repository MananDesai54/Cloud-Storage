import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { CloudModel } from 'src/app/models/cloud.model';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
})
export class RootComponent implements OnInit {
  cloudSubscription: Subscription;
  cloud: CloudModel;

  constructor(
    private cloudService: CloudService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.cloud = data.cloud;
    });
  }
}
