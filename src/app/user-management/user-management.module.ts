import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [{ path: '', component: UserManagementComponent }];

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [UserManagementComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class UserManagementModule {}
