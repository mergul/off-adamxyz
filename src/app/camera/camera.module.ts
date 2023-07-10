import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CameraGuard } from './camera.guard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: CameraComponent, canActivate: [CameraGuard] },
];

@NgModule({
  declarations: [CameraComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    TextFieldModule,
  ],
  entryComponents: [],
  providers: [CameraGuard],
  bootstrap: [CameraComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class CameraModule {}
