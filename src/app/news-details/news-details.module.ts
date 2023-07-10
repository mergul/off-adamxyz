import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsDetailsComponent } from './news-details.component';
// import { MediaSourceComponent} from '../media-source/media-source.component';
import { MediaSocialComponent } from '../media-social/media-social.component';
import { NewsManageComponent } from '../news-manage/news-manage.component';
// import {StackedModalModule} from '../stacked-modal/stacked-modal.module';
// import { VgControlsModule} from 'videogular2/compiled/src/controls/controls';
// import { VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
// import { VgCoreModule} from 'videogular2/compiled/src/core/core';
// import { VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import { FilesListComponent } from '../files-list/files-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogDetailsContainerComponent } from './dialog-details-container.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { PostComponent } from '../post/post.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommentsComponent } from '../comments/comments.component';
import { ScrollDirective } from '../core/scroll.directive';
import { OfferComponent } from './offer/offer.component';
import { MatIconModule } from '@angular/material/icon';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferPostComponent } from './offer-post/offer-post.component';
import { OfferPostDetailsComponent } from './offer-post-details/offer-post-details.component';
import { SafeHtmlPipe } from '../core/safe-html.pipe';
import { CarouselComponent } from '../carousel/carousel.component';

const routes: Routes = [
  // {
  //   path: ':id',
  //   component: DialogDetailsContainerComponent,
  // },
  // {
  //   path: 'upload',
  //   component: GenericModalComponent,
  //   canActivate: [AuthsGuard],
  // },
];

@NgModule({
  declarations: [
    DialogDetailsContainerComponent,
    NewsDetailsComponent,
    ScrollDirective,
    MediaSocialComponent,
    NewsManageComponent,
    FilesListComponent,
    PostComponent,
    CommentsComponent,
    OfferComponent,
    OfferListComponent,
    OfferPostComponent,
    OfferPostDetailsComponent,
    CarouselComponent,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule, // StackedModalModule
    // VgControlsModule,
    // VgBufferingModule,
    // VgCoreModule,
    // VgOverlayPlayModule,
  ],
  entryComponents: [NewsDetailsComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    DialogDetailsContainerComponent,
    NewsDetailsComponent,
    MediaSocialComponent,
    FilesListComponent,
    CommentsComponent,
    ScrollDirective,
    NewsManageComponent,
    PostComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OfferComponent,
    OfferListComponent,
    OfferPostComponent,
    OfferPostDetailsComponent,
    CarouselComponent,
    MatDialogModule,
  ],
})
export class NewsDetailsModule {}
