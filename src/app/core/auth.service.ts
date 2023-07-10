import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
import firebase from 'firebase/app';
import User = firebase.User;

@Injectable({ providedIn: 'root' })
export class AuthService {
  checkComplete = false;
  user$: Observable<User | null>;
  token!: Observable<string>;
  changeEmitter = new EventEmitter<Observable<boolean>>();

  constructor(public afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }
  getUser(): Observable<User | null> {
    return this.user$.pipe(
      first(),
      map((user) => {
        if (user !== null) this.token = from(user.getIdToken());
        return user;
      })
    );
  }
  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      map((authState) => !!authState)
    );
  }
  loginToGoogle(isMobile: boolean): Observable<User | null> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    if (isMobile) {
      return from(this.afAuth.signInWithRedirect(provider)).pipe(
        switchMap(() => {
          return from(this.afAuth.getRedirectResult());
        }),
        switchMap((credo) => {
          this.changeEmitter.next(of(true));
          return of(credo.user);
        })
      );
    } else {
      return from(this.afAuth.signInWithPopup(provider)).pipe(
        switchMap((credo) => {
          this.changeEmitter.next(of(true));
          return of(credo.user);
        })
      );
    }
  }
  doRegister(value: any): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => {
            this.changeEmitter.next(of(true));
            resolve(res.user);
          },
          (err) => reject(err)
        )
        .catch(function (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    });
  }
  loginDo(value: any): Observable<User | null> {
    return from(
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
    ).pipe(
      switchMap((credo) => {
        this.changeEmitter.next(of(true));
        return of(credo.user);
      })
    );
  }
  doLogout() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser !== null) {
        this.afAuth.signOut();
        resolve('');
      } else {
        reject();
      }
    });
  }

  getCurrentIdToken(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  resetPassword(email: string) {
    return this.afAuth
      .sendPasswordResetEmail(email, {
        url: 'http://localhost:4200/auth', // Here we redirect back to this same page.
        handleCodeInApp: true, // This must be true.
      })
      .then(() => console.log('sent Password Reset Email!'))
      .catch((error) => console.log(error));
  }
  updatePassword(email: string, newPassword: string) {
    this.afAuth.sendPasswordResetEmail(newPassword).then((r) => r);
  }
  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (userd) {
        if (userd) {
          resolve(userd);
        } else {
          reject('No user logged in');
        }
      });
    });
  }
  updateCurrentUser(value: { name: any }) {
    return new Promise((resolve, reject) => {
      const user = this.afAuth.currentUser;
      user.then((ud) =>
        ud
          ?.updateProfile({
            displayName: value.name,
            photoURL: ud.photoURL,
          })
          .then(
            () => {
              resolve('User Successfully Updated');
            },
            (err) => reject(err)
          )
      );
    });
  }
}
