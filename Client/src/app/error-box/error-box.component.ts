import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-box',
  templateUrl: './error-box.component.html',
  styleUrls: ['./error-box.component.css'],
})
export class ErrorBoxComponent implements OnInit {
  @Input() errorMessage: any;
  @Input() modal: boolean;
  @Input() success: boolean;
  @ViewChild('box') box: ElementRef;
  constructor() {}

  ngOnInit(): void {}
  onClose() {
    this.box.nativeElement.style.display = 'none';
  }
}
