import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  Renderer2,
  HostListener,
} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { NewsService } from '../core/news.service';
import { UserService } from '../core/user.service';
import { FirebaseUserModel } from '../core/user.model';
import { forkJoin, from, of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  catchError,
  first,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import firebase from 'firebase/app';
import User = firebase.User;

@Component({
  selector: 'app-page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy = new Subject<void>();
  loginForm!: FormGroup;
  errorMessage = '';
  error: { name: string; message: string } = { name: '', message: '' };
  email = '';
  resetPassword = false;
  listenerFn!: () => void;
  color: string;
  wideStyle!: { width: string };
  id: any;
  EMAIL_REGEXP =
    /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  isValidMailFormat = of(false);

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2,
    public userService: UserService
  ) {
    this.createForm();
    this.color = data.color;
  }

  ngOnInit() {
    const modalWidth = this.data.header$;
    this.wideStyle = {
      width: `${modalWidth}px`,
    };
    this.isValidMailFormat = of(
      this.loginForm.controls.email.value.toString().length === 0 &&
        !this.EMAIL_REGEXP.test(this.loginForm.controls.email.value)
    );
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  setLoggedUser = (user: User) => {
    if (!this.userService.user) this.userService.user = new FirebaseUserModel();
    this.userService._loggedUser = this.userService.user;
    this.userService._loggedUser.id = this.userService.user.id =
      this.userService.createId(user.uid);
    this.userService.setReactiveListeners();
    if (this.userService.redirectUrl === 'login') {
      this.authService.checkComplete = true;
      return from(user.getIdToken()).pipe(
        first(),
        switchMap((token) => {
          if (this.userService.user) this.userService.user.token = token;
          return this.userService.getDbUser(
            '/api/rest/user/' +
              this.userService.user?.id +
              '/' +
              this.userService.getRandom() +
              '/0'
          );
        }),
        switchMap((tokens) => {
          this.userService.setDbUser(tokens);
          return of(this.onClose('user'));
        })
      );
    } else {
      this.authService.checkComplete = false;
      return forkJoin([
        this.userService.getDbUser(
          '/api/rest/start/user/' +
            this.userService.user.id +
            '/' +
            this.userService.getRandom()
        ),
        from(user.getIdToken()),
      ]).pipe(
        mergeMap((tokens) => {
          this.userService.setDbUser(tokens[0]);
          if (this.userService.user) this.userService.user.token = tokens[1];
          return this.userService.redirectUrl !== 'login'
            ? of(this.onClose(this.userService.redirectUrl))
            : of(this.onClose('user'));
        })
      );
    }
  };
  tryFacebookLogin() {}

  tryTwitterLogin() {}
  triedGoogleLogin() {
    this.authService
      .loginToGoogle(this.data.header$ < 600)
      .pipe(
        takeUntil(this.destroy),
        switchMap((user) => {
          if (user) {
            return this.setLoggedUser(user);
          }
          return of();
        })
      )
      .subscribe();
  }
  tryLogin(value: any) {
    this.authService
      .loginDo(value)
      .pipe(
        takeUntil(this.destroy),
        switchMap((user) => {
          if (user) {
            return this.setLoggedUser(user);
          }
          return of();
        }),
        catchError((val) => {
          this.errorMessage = val.message;
          return of(`I caught: ${val}`);
        })
      )
      .subscribe();
  }
  sendResetEmail() {
    this.clearErrorMessage();

    this.authService
      .resetPassword(this.loginForm.controls.email.value)
      .then(() => {
        this.resetPassword = true;
        this._snackBar.open(
          'A password reset link has been sent to your email address!',
          'Check your email address!!!',
          {
            duration: 3000,
          }
        );
      })
      .catch((_error) => {
        this.error = _error;
      });
  }
  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }
  ngAfterViewInit() {
    this.renderer.setStyle(
      this._document.querySelector('.mat-dialog-container'),
      'background-color',
      this.color
    );
  }

  onClose(redir: string) {
    if (redir === 'home') {
      this.newsService.activeLink = 'En Çok Okunanlar';
      this.dialogRef.close(redir);
    }
    this.dialogRef.close(redir);
  }

  onDialogClick(event: UIEvent) {
    event.stopPropagation();
    event.cancelBubble = true;
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
    this.destroy.next();
    this.destroy.complete();
  }
}
