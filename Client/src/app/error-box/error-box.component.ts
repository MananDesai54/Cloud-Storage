import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-box',
  templateUrl: './error-box.component.html',
  styleUrls: ['./error-box.component.css'],
})
export class ErrorBoxComponent implements OnInit {
  @Input() errorMessage: any;
  constructor() {}

  ngOnInit(): void {}
}
