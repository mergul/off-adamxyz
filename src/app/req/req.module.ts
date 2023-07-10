import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from '../core/auths.guard';
import { ReqComponent } from './req.component';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';
import { SharedModalModule } from '../shared-modal/shared-modal.module';

const routes: Routes = [
  { path: '', component: GenericModalComponent, canActivate: [AuthsGuard] },
];

@NgModule({
  declarations: [ReqComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModalModule],
  entryComponents: [],
  providers: [AuthsGuard],
  bootstrap: [ReqComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CommonModule],
})
export class ReqModule {}
