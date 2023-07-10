import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Type, OnDestroy, Component } from '@angular/core';
import { MultiFilesUploadComponent } from '../multi-files-upload/multi-files-upload.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReqComponent } from '../req/req.component';
import { WindowRef } from '../core/window.service';
import { takeUntil } from 'rxjs/operators';

export const entryComponentsMap = {
  upload: MultiFilesUploadComponent,
  login: LoginComponent,
  register: RegisterComponent,
  loginin: ReqComponent,
};

@Component({
  selector: 'app-modal-container',
  template: ``,
})
export class GenericModalComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog!: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private router: Router,
    private winRef: WindowRef
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = '2';
    dialogConfig.disableClose = true;
    const wid = this.winRef.nativeWindow.innerWidth;
    const modalWidth = wid >= 908 ? 808 : wid - (100 * wid) / 908;
    dialogConfig.width = modalWidth + 'px';
    dialogConfig.maxWidth = modalWidth + 'px';
    dialogConfig.height = this.winRef.nativeWindow.innerHeight + 'px';
    dialogConfig.data = {
      color: 'lightgrey',
      header$: modalWidth - 24,
    };
    const ut = this.location.path().split('/');
    this.currentDialog = this.dialog.open(
      this.getClazz(ut.pop()),
      dialogConfig
    );
    this.currentDialog
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        console.log('closing GenericModalComponent', ut);
        if (result && result !== '') {
          this.router.navigateByUrl(result);
        } else if (ut.length < 3) {
          // this.location.back();
          this.location.go(ut.join('/'));
        } else this.location.go(ut.join('/'));
      });
  }
  public getClazz(name) {
    const factories = Array.of('upload', 'login', 'register', 'loginin');
    const frt = factories.find((x: string) => x === name);
    if (frt) {
      return <Type<any>>entryComponentsMap[frt];
    } else return <Type<any>>entryComponentsMap['login'];
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
