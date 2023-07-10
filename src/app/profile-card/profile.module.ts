import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsListModule } from '../news-list/news-list.module';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ProfileCardComponent } from './profile-card.component';
import { ProfileListComponent } from '../profile-list/profile-list.component';
import { ProfileCenterComponent } from '../profile-center/profile-center.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AccountHistoryComponent } from '../account-history/account-history.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MoneyManageComponent } from '../money-manage/money-manage.component';
import { UserSelectionsComponent } from '../user-selections/user-selections.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
    EditProfileComponent,
    ProfileCardComponent,
    ProfileListComponent,
    ProfileCenterComponent,
    AccountHistoryComponent,
    MoneyManageComponent,
    UserSelectionsComponent,
  ],
  imports: [
    RouterModule,
    NewsListModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  entryComponents: [],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ProfileHeaderComponent,
    EditProfileComponent,
    ProfileCardComponent,
    ProfileListComponent,
    ProfileCenterComponent,
    AccountHistoryComponent,
    MoneyManageComponent,
    UserSelectionsComponent,
    NewsListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class ProfileModule {}
