import { MultiFilesUploadComponent } from './multi-files-upload.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from '../core/auths.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesThumbnailsComponent } from '../files-thumbnails/files-thumbnails.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModalModule } from '../shared-modal/shared-modal.module';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';

const routes: Routes = [
  { path: '', component: GenericModalComponent, canActivate: [AuthsGuard] },
];

@NgModule({
  declarations: [MultiFilesUploadComponent, FilesThumbnailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModalModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  entryComponents: [MultiFilesUploadComponent],
  providers: [AuthsGuard],
  bootstrap: [MultiFilesUploadComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule, MultiFilesUploadComponent, MatIconModule],
})
export class MultiFilesUploadModule {}
