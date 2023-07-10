import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedNavComponent } from './logged-nav.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
  },
  {
    path: ':id/upload',
    loadChildren: () =>
      import('../multi-files-upload/multi-files-upload.module').then(
        (m) => m.MultiFilesUploadModule
      ),
  },
  {
    path: 'camera',
    loadChildren: () =>
      import('../camera/camera.module').then((m) => m.CameraModule),
  },
];

@NgModule({
  declarations: [LoggedNavComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    OverlayModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [LoggedNavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CommonModule,
    LoggedNavComponent,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
})
export class LoggedNavModule {}
