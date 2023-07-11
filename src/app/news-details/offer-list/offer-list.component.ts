import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { BackendServiceService } from 'src/app/core/backend-service.service';
import { OfferPayload } from 'src/app/core/news.model';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['../../news-list/news-list.component.scss'],
})
export class OfferListComponent implements OnInit {
  offerList!: Observable<Array<OfferPayload>>;
  public _myWidth!: string;
  private _urLinks!: Observable<Array<OfferPayload>>;
  constructor(
    @Optional() public dialogRef: MatDialogRef<OfferListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private backendService: BackendServiceService
  ) {
    if (data && data.ids) {
      this._myWidth = '' + (data.width - 40);
      this.offerList = this.backendService.getOffers(data.ids).pipe();
    }
  }

  ngOnInit(): void {
    if (!(this.data && this.data.ids)) this.offerList = this._urLinks;
  }
  @Input()
  get urlis(): Observable<Array<OfferPayload>> {
    return this._urLinks;
  }

  set urlis(value: Observable<Array<OfferPayload>>) {
    this._urLinks = value;
  }
  @Input()
  get myWidth() {
    return this._myWidth;
  }

  set myWidth(width: string) {
    this._myWidth = '' + (+width - 40);
  }
  byId(index: number, item: OfferPayload) {
    if (!item) {
      return '0';
    }
    return item.newsId;
  }
  closeOfferList() {
    this.dialogRef.close();
  }
}
