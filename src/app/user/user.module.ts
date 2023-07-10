import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProfileModule } from '../profile-card/profile.module';
import { IbanValidatorDirective } from '../iban-validator.directive';
import { DialogDetailsContainerComponent } from '../news-details/dialog-details-container.component';
import { DbUserResolver } from './db.user.resolver';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

const routes: Routes = [
  {
    path: 'edit',
    component: UserComponent,
    resolve: { data: DbUserResolver },
    children: [
      {
        path: 'upload',
        component: GenericModalComponent,
      },
    ],
  },
  {
    path: '',
    component: UserComponent,
    resolve: { data: DbUserResolver },
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
  declarations: [UserComponent, IbanValidatorDirective],
  imports: [CommonModule, RouterModule.forChild(routes), ProfileModule],
  entryComponents: [],
  providers: [DbUserResolver],
  bootstrap: [UserComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class UserModule {}
