import { Component, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { OfferPayload } from 'src/app/core/news.model';
import { OfferPostDetailsComponent } from '../offer-post-details/offer-post-details.component';
import { BackendServiceService } from 'src/app/core/backend-service.service';
import { WindowRef } from 'src/app/core/window.service';

@Component({
  selector: 'app-offer-post',
  templateUrl: './offer-post.component.html',
  styleUrls: ['../../post/post.component.scss'],
})
export class OfferPostComponent implements OnInit {
  private _url!: string;
  private _offer!: OfferPayload;
  maNextDialog!: MatDialogRef<OfferPostDetailsComponent, any>;
  public _width!: string;
  // myNextDialog!: MatDialogRef<CarouselComponent, any>;

  constructor(
    private modalService: MatDialog,
    public winRef: WindowRef,
    private backendService: BackendServiceService
  ) {}

  ngOnInit(): void {}
  @Input()
  get offer() {
    return this._offer;
  }

  set offer(offer: OfferPayload) {
    this._offer = offer;
    this._url = 'url(' + offer.id + ')';
  }
  @Input()
  get myWidth() {
    return this._width;
  }

  set myWidth(width: string) {
    this._width = width;
  }
  offerDetails() {
    this.backendService
      .getOffer(this._offer.id)
      .pipe()
      .subscribe((x) => {
        const matDialogConfig = new MatDialogConfig();
        matDialogConfig.width = this._width + 'px';
        matDialogConfig.maxWidth = this._width + 'px';
        matDialogConfig.autoFocus = false;
        matDialogConfig.id = '4';
        matDialogConfig.data = { offer: x, width: this._width };
        this.maNextDialog = this.modalService.open(
          OfferPostDetailsComponent,
          matDialogConfig
        );
        // this.myNextDialog = this.modalService.open(CarouselComponent, {
        //   id: '4',
        //   data: { mediaReviews: x.mediaReviews },
        // });
      });
  }
  onTagClick(tag) {}
  getIt(i: number) {
    return this._offer.topic
      .split('#')
      [i + 1].replace(this._offer.tags[i].substring(1), '');
  }
}
