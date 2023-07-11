import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { of, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { NewsDetailsComponent } from './news-details.component';
import { NewsService } from '../core/news.service';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { WindowRef } from '../core/window.service';
import { SpeechService } from '../core/speech-service';
import { News } from '../core/news.model';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-details-container',
  template: ``,
})
export class DialogDetailsContainerComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog!: MatDialogRef<NewsDetailsComponent>;

  constructor(
    private modalService: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private winRef: WindowRef,
    private router: Router,
    private service: NewsService,
    private speechService: SpeechService,
    overlay: Overlay
  ) {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy),
        switchMap((params: ParamMap) => {
          const url = params.get('id') || '';
          if (url && url !== 'upload') {
            return this.service.getNewsById(url);
          }
          return of(this.service.getEmptyNews(url));
        })
      )
      .subscribe((news: News) => {
        if (news.id) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = '1';
          dialogConfig.disableClose = false;
          const wid = this.winRef.nativeWindow.innerWidth;
          const modalWidth = wid >= 908 ? 808 : wid - (100 * wid) / 908;
          dialogConfig.width = modalWidth + 'px';
          dialogConfig.maxWidth = modalWidth + 'px';
          dialogConfig.height = this.winRef.nativeWindow.innerHeight + 'px';
          const ut = this.location.path().split('/');
          news.offers = news.offers.filter((x) => x !== '');
          if (!this.service.newzes$.has(news.id)) {
            this.service.newzes$.set(news.id, news);
          }
          // When router navigates on this component is takes the params and opens up the photo detail modal
          dialogConfig.data = {
            news$: news,
            color: 'lightgrey', //'whitesmoke',
            header$: modalWidth - 24,
          };
          dialogConfig.autoFocus = false;
          dialogConfig.restoreFocus = false;
          this.currentDialog = this.modalService.open(
            NewsDetailsComponent,
            dialogConfig
          );
          // Go back to home page after the modal is closed
          this.currentDialog
            .afterClosed()
            .pipe(takeUntil(this.destroy))
            .subscribe((result) => {
              console.log('closing DialogDetailsContainerComponent');
              if (this.speechService.navSpeech)
                this.speechService.navSpeech.next(news.id);
              if (result && result !== '') {
                this.router.navigateByUrl(result, {
                  state: { userID: news.ownerId },
                });
              } else {
                ut.pop();
                ut.pop();
                this.location.go(ut.join('/'));
                this.location.replaceState(ut.join('/'), '');
              }
            });
        } else this.router.navigateByUrl(news.ownerUrl);
      });
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
