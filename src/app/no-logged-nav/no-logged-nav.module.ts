import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoLoggedNavComponent } from './no-logged-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { LoggedNavModule } from '../logged-nav/logged-nav.module';

const routes: Routes = [
  {
    path: 'loginin',
    loadChildren: () => import('../req/req.module').then((m) => m.ReqModule),
  },
];

@NgModule({
  declarations: [NoLoggedNavComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LoggedNavModule],
  exports: [NoLoggedNavComponent],
})
export class NoLoggedNavModule {}
