import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { GenericModalComponent } from './generic-modal.component';

@NgModule({
  declarations: [GenericModalComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [GenericModalComponent],
})
export class SharedModalModule {}
