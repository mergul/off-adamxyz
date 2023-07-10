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
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchingPasswords } from './validators';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../core/user.service';
import { FirebaseUserModel } from '../core/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, of, forkJoin, Subject } from 'rxjs';
import { first, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/app';
import User = firebase.User;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy = new Subject<void>();
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  listenerFn!: () => void;
  color: string;
  wideStyle!: { width: string };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2
  ) {
    this.createForm();
    this.color = data.color;
  }
  ngOnInit(): void {
    const modalWidth = this.data.header$;
    this.wideStyle = {
      width: `${modalWidth}px`,
    };
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  createForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        password2: ['', Validators.required],
        sozlesme: [false, Validators.requiredTrue],
      },
      { validator: matchingPasswords('password', 'password2') }
    );
  }
  isFieldValid(field: string) {
    return (
      !this.registerForm.get(field)?.valid &&
      this.registerForm.get(field)?.touched
    );
  }

  tryFacebookLogin() {}

  tryTwitterLogin() {}
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
  tryGoogleLogin() {
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

  tryRegister(value) {
    this.authService.doRegister(value).then(
      (res) => {
        res
          .sendEmailVerification({
            url: 'http://localhost:4200/auth', // Here we redirect back to this same page.
            handleCodeInApp: true, // This must be true.
          })
          .then(() => {
            this._snackBar.open(
              'Verification Email Sent!',
              'Check yor email please!',
              {
                duration: 3000,
              }
            );
            setTimeout(
              () => this.router.navigate([this.userService.redirectUrl]),
              1000
            );
          });
        res
          .updateProfile({
            displayName: value.name,
            photoURL: '',
          })
          .then(
            function () {
              // Update successful.
            },
            function () {
              // An error happened.
            }
          );
        res.getIdToken().then((idToken) => {
          if (this.userService.user) this.userService.user.token = idToken;
          const fg = new FirebaseUserModel();
          fg.token = idToken;
          const ilkp = res.email;
          if (ilkp) fg.email = ilkp;
          fg.id = res.uid;
          fg.provider = 'auth';
          fg.name = value.name;
          this.userService.loggedUser = fg;
          this.errorMessage = '';
          this.successMessage = 'Your account has been created';
        });
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    );
  }
  ngAfterViewInit() {
    this.renderer.setStyle(
      this._document.querySelector('.mat-dialog-container'),
      'background-color',
      this.color
    );
  }

  onClose(redir) {
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
