import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-media-social',
  templateUrl: './media-social.component.html',
  styleUrls: ['./media-social.component.scss']
})
export class MediaSocialComponent implements OnInit {
  private _social = of(false);
  url!: string;
  text = '';
  imageUrl = '';

  constructor() {
  }
  ngOnInit() {
    this.url = encodeURIComponent(location.href);
  }
  @Input()
  get social(): Observable<boolean> {
    return this._social;
  }
  set social(value: Observable<boolean>) {
    this._social = value;
  }
  shareOnTwitter() {
    const url = 'https://twitter.com/intent/tweet?url=' + this.url;
    window.open(url, 'TwitterWindow');
    return false;
  }
  shareOnFacebook() {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + this.url;
    window.open(url, 'TwitterWindow');
    return false;
  }
  shareOnLinkedIn() {
    const url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.url;
    window.open(url, 'TwitterWindow');
    return false;
  }
  shareOnReddit() {
    const url = 'https://reddit.com/submit?url=' + this.url;
    window.open(url, 'TwitterWindow');
    return false;
  }
  shareOnPinterest() {
    const url = 'https://www.pinterest.com/pin/find/?url=' + this.url;
    window.open(url, 'TwitterWindow');
    return false;
  }
}
