import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/user.service';
import { matchingPasswords } from '../register/validators';
import { FirebaseUserModel, User } from '../core/user.model';
import { Subject } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { IbanValidatorDirective } from '../iban-validator.directive';
import { takeUntil } from 'rxjs/operators';
import { ReactiveStreamsService } from '../core/reactive-streams.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  public profileForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  _user!: User | undefined;
  user$: FirebaseUserModel = new FirebaseUserModel();
  private _booled!: boolean;
  private readonly onDestroy = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private reactiveService: ReactiveStreamsService
  ) {
    this.createForm();
  }
  @Input()
  get user(): User | undefined {
    return this._user ? this._user : this.userService.dbUser;
  }
  set user(value: User | undefined) {
    this._user = value;
  }
  @Input()
  get booled(): boolean {
    return this._booled;
  }
  set booled(value: boolean) {
    this._booled = value;
  }
  ngOnInit() {
    this.reactiveService
      .getMessage('user-history')
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.userService._totalBalance =
            +value[value.length - 1].totalBalance.toFixed(2);
        }
      });
  }
  createForm() {
    this.profileForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        iban: ['', [Validators.required, IbanValidatorDirective.validateIt]],
        password: ['', Validators.required],
        password2: ['', Validators.required],
      },
      { validator: matchingPasswords('password', 'password2') }
    );
  }

  trySave(value: any) {
    const summary = document.querySelector('#proInput')?.innerHTML;
    if (this.userService.dbUser && this.userService.loggedUser) {
      if (summary && summary.trim() !== this.userService.dbUser.summary) {
        this.userService
          .newSummary(this.userService.dbUser.id, summary)
          .pipe(takeUntil(this.onDestroy))
          .subscribe((value1) => {
            if (this.userService.dbUser)
              this.userService.dbUser.summary = summary;
          });
      }
      if (
        value.iban.trim() !== '' &&
        value.iban.trim() !== this.userService.loggedUser.iban &&
        this.profileForm.controls.iban.valid
      ) {
        this.userService.dbUser.iban = value.iban.trim();
        this.userService
          .updateUser(this.userService.dbUser)
          .pipe(takeUntil(this.onDestroy))
          .subscribe();
      }
      if (!this.profileForm.hasError('mismatchedPasswords')) {
        if (value.name !== this.userService.loggedUser.name) {
          this.authService.updateCurrentUser(value);
        }
        if (
          value.password.trim().length > 5 &&
          value.email.trim() === this.userService.dbUser.email
        ) {
          this.authService.updatePassword(value.email, value.password);
        } else if (
          value.password.trim().length > 5 &&
          value.email.trim() !== this.userService.dbUser.email
        ) {
          this.authService.doRegister(value);
        }
      }
    }
  }
  onDialogClick(event: UIEvent) {
    event.stopPropagation();
    event.cancelBubble = true;
  }
  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
