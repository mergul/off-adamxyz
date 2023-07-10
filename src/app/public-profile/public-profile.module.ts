import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileComponent } from './public-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileModule } from '../profile-card/profile.module';
import { DialogDetailsContainerComponent } from '../news-details/dialog-details-container.component';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';

const routes: Routes = [
  {
    path: '',
    component: PublicProfileComponent,
    children: [
      {
        path: 'news-details/:id',
        component: DialogDetailsContainerComponent,
      },
      {
        path: 'upload',
        component: GenericModalComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [PublicProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ProfileModule],
  entryComponents: [],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class PublicProfileModule {}
