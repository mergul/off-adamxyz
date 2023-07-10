import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../core/user.service';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['../user/user.scss'],
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  private _boolUser!: Observable<number>;
  private readonly onDestroy = new Subject<void>();

  constructor(
    public userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @Input()
  get boolUser(): Observable<number> {
    return this._boolUser;
  }

  set boolUser(value: Observable<number>) {
    this._boolUser = value;
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  onSelectFile($event: any, ind: number) {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      this.document.createElement('canvas')
    );
    const context = canvas.getContext('2d');
    if (context) {
      const file = $event.target.files[0];
      const reader = new FileReader();
      const image = new Image();
      let width, height;
      if (ind === 1) {
        width = 800;
        height = 200;
      } else {
        width = 300;
        height = 300;
      }
      reader.onload = (event: any) => {
        image.setAttribute('src', event.target.result);
        image.onload = () => {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (ind === 0) {
                  this.prof_url = window.URL.createObjectURL(blob);
                  this.onDumpPics(
                    this.userService.dbUser?.id + '-profile-img',
                    blob
                  );
                } else {
                  this.back_url = window.URL.createObjectURL(blob);
                  this.onDumpPics(
                    this.userService.dbUser?.id + 'back-img',
                    blob
                  );
                }
              }
            },
            'image/jpeg',
            0.5
          );
        };
      };
      reader.readAsDataURL(file);
    }
  }
  onDumpPics(name: string, img: Blob) {
    const main_form: FormData = new FormData();
    main_form.append(name, img);
    return this.userService
      .postUserImage(main_form)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => value);
  }
  get prof_url(): string {
    return this.userService.prof_url;
  }

  set prof_url(value: string) {
    this.userService.prof_url = value;
  }

  get back_url(): string {
    return this.userService.back_url;
  }

  set back_url(value: string) {
    this.userService.back_url = value;
  }
}
