import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from '../core/auths.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';
import { SharedModalModule } from '../shared-modal/shared-modal.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  { path: '', component: GenericModalComponent, canActivate: [AuthsGuard] },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModalModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
  ],
  entryComponents: [LoginComponent],
  providers: [AuthsGuard],
  bootstrap: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class LoginModule {}
