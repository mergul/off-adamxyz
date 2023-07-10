import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from '../core/auths.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModalModule } from '../shared-modal/shared-modal.module';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';

const routes: Routes = [
  { path: '', component: GenericModalComponent, canActivate: [AuthsGuard] },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModalModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  entryComponents: [RegisterComponent],
  providers: [AuthsGuard],
  bootstrap: [RegisterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class RegisterModule {}
