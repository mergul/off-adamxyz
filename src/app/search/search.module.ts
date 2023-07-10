import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfileModule } from '../profile-card/profile.module';
import { DialogDetailsContainerComponent } from '../news-details/dialog-details-container.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      { path: 'news-details/:id', component: DialogDetailsContainerComponent },
      {
        path: 'upload',
        component: GenericModalComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProfileModule,
    MatInputModule,
    MatTabsModule,
  ],
  entryComponents: [],
  bootstrap: [SearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class SearchModule {}
