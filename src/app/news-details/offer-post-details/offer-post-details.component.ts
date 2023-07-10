import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendServiceService } from 'src/app/core/backend-service.service';
import { Offer } from 'src/app/core/news.model';

@Component({
  selector: 'app-offer-post-details',
  templateUrl: './offer-post-details.component.html',
  styleUrls: ['./offer-post-details.component.scss'],
})
export class OfferPostDetailsComponent implements OnInit, AfterViewInit {
  public _offer!: Offer;
  private _myOffer!: Offer;
  _width!: number;
  constructor(
    public dialogRef: MatDialogRef<OfferPostDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private backendService: BackendServiceService
  ) {
    if (data && data.offer) {
      this._offer = data.offer;
      this._width = +data.width;
    }
  }

  ngOnInit(): void {
    if (!(this.data && this.data.offer)) {
      this._offer = this._myOffer;
    }
  }
  @Input()
  get myOffer(): Offer {
    return this._myOffer;
  }

  set myOffer(value: Offer) {
    this._myOffer = value;
  }
  ngAfterViewInit() {}
  acceptOffer() {
    this.backendService
      .completeOffer(this._offer.newsId, this._offer.id)
      .subscribe((x) => this.dialogRef.close());
  }
  closeModal() {
    this.dialogRef.close();
  }
}
