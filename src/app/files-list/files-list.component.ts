import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { News } from '../core/news.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WindowRef } from '../core/window.service';

@Component({
  selector: 'app-files-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
})
export class FilesListComponent implements OnInit {
  itemWidth!: number;
  private _thumbName!: string;
  _imgUrl!: SafeUrl;
  _imgUrlWeb!: SafeUrl;
  private _news!: News;
  width!: number;
  height!: number;

  constructor(public sanitizer: DomSanitizer, private winRef: WindowRef) {}

  @Input()
  get news() {
    return this._news;
  }

  set news(value: News) {
    this._news = value;
    if (!this._thumbName) {
      this._thumbName =
        this._news.id + '-thumb-kapak-' + this._news.mediaReviews[0].file_name;
    }
  }

  @Input()
  get thumbName() {
    return this._thumbName;
  }

  set thumbName(thumbName: string) {
    const lastIndex = thumbName.lastIndexOf('.');
    if (!this._imgUrl) {
      if (thumbName.startsWith('medium-')) {
        this.itemWidth = this.winRef.nativeWindow.innerWidth - 40;
        if (this.itemWidth > 788) {
          this.itemWidth = 788;
        }
        this.width = this.itemWidth;
        this.height = 500 * (this.itemWidth / 788);
      } else if (thumbName.startsWith('amedium-')) {
        this.itemWidth = this.winRef.nativeWindow.innerWidth - 20;
        if (this.itemWidth > 595) {
          this.itemWidth = 595;
        }
        this.width = this.itemWidth;
        this.height = 500 * (this.itemWidth / 788);
      } else {
        this.itemWidth = this.winRef.nativeWindow.innerWidth - 40;
        if (this.itemWidth > 1040) {
          this.width = 174;
          this.height = 109;
        } else {
          this.width = 174 * (4 / 5);
          this.height = 109 * (4 / 5);
        }
      }
      this._thumbName = thumbName.startsWith('amedium-')
        ? thumbName.slice(1)
        : thumbName;
      this._imgUrl = this.sanitizer.bypassSecurityTrustUrl(
        'assets/' + this._thumbName
      );
      this._imgUrlWeb = this.sanitizer.bypassSecurityTrustUrl(
        'assets/' + this._thumbName.substring(0, lastIndex) + '.webp'
      );
    }
  }

  ngOnInit() {}
}
