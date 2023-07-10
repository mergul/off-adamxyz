import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './news-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NewsDetailsModule } from '../news-details/news-details.module';
import { EditTagsListComponent } from '../edit-tags-list/edit-tags-list.component';
const routes: Routes = [];
@NgModule({
  declarations: [NewsListComponent, EditTagsListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NewsDetailsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [NewsListComponent, NewsDetailsModule, EditTagsListComponent],
})
export class NewsListModule {}
