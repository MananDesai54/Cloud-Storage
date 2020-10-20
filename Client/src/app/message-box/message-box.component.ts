import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
})
export class MessageBoxComponent implements OnInit {
  @Input() message: any;
  @Input() modal: boolean;
  @Input() success: boolean;
  @ViewChild('box') box: ElementRef;
  constructor() {}

  ngOnInit(): void {}
  onClose() {
    this.box.nativeElement.style.display = 'none';
  }
}
