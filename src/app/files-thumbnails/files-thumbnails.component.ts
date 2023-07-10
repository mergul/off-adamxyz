import {Component, Input, OnInit} from '@angular/core';
import {MultiFilesService} from '../multi-files-upload/multi-files.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-files-thumbnails',
  templateUrl: './files-thumbnails.component.html',
  styleUrls: ['./files-thumbnails.component.scss']
})
export class FilesThumbnailsComponent implements OnInit {
  private _thumbs: Array<string>|null = [];
  constructor(private service: MultiFilesService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  @Input()
  get thumbs(): Array<string>|null {
    return this._thumbs;
  }

  set thumbs(value: Array<string>|null) {
    this._thumbs = value;
  }

  removeItem(i: number) {
    this.service.remove(i);
  }
}
