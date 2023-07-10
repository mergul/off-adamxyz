import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { NewsListModule } from '../news-list/news-list.module';
import * as Hammer from 'hammerjs';
import {
  HammerModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DialogDetailsContainerComponent } from '../news-details/dialog-details-container.component';
import { GenericModalComponent } from '../shared-modal/generic-modal.component';
@Injectable({ providedIn: 'root' })
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'news-details/:id',
        component: DialogDetailsContainerComponent,
      },
      {
        path: 'upload',
        component: GenericModalComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NewsListModule,
    HammerModule,
  ],
  entryComponents: [],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  bootstrap: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [HammerModule],
})
export class HomeModule {}
