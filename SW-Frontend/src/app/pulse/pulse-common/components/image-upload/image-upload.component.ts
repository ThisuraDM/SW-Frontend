import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'SW-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() fileName =null;
  @Output() selectFile = new EventEmitter<any>();
  @Output() removeFile = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  onFileChanged(event:any){
    this.selectFile.emit(event);
  }
}
