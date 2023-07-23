import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { User } from '../core/user.model';
import { UserService } from '../core/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, Subject } from 'rxjs';
import { WindowRef } from '../core/window.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  _user!: User;
  private _prof_url!: string;
  private _back_url = 'http://lorempixel.com/850/280/nightlife/5/';
  folli = false;
  subscription_newslist!: Subscription;
  listStyle = {};
  @ViewChild('followButton', { static: false })
  followButton!: ElementRef;

  constructor(
    public userService: UserService,
    private router: Router,
    public domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    public route: ActivatedRoute,
    private winRef: WindowRef
  ) {}
  @Input()
  get user(): User {
    return this._user;
  }
  set user(user1: User) {
    this._user = user1;
    this.folli =
      this.userService.loggedUser != null &&
      this.userService.loggedUser.people.includes(this.user.id);
    const leng = user1.mediaParts ? user1.mediaParts.length : 0;
    if (leng > 0) {
      user1.mediaParts.forEach((thumb) => {
        const img = thumb === 1 ? 'back-img.jpeg' : 'profile-img.jpeg';
        if (thumb === 1) {
          this.back_url =
            'https://storage.googleapis.com/sentral-news-media/' +
            user1.id +
            '-' +
            img;
          if (leng === 1) {
            this.prof_url =
              'https://storage.googleapis.com/sentral-news-media/' + img;
          }
        } else if (thumb === 0) {
          this.prof_url =
            'https://storage.googleapis.com/sentral-news-media/' +
            user1.id +
            '-' +
            img;
          if (leng === 1) {
            this.back_url =
              'https://storage.googleapis.com/sentral-news-media/' + img;
          }
        }
      });
    } else if (leng === 0) {
      this.prof_url =
        '/assets/' + // 'https://storage.googleapis.com/sentral-news-media/'
        'profile-img.jpeg'; // this.loggedUser.image;
      this.back_url =
        '/assets/' + // 'https://storage.googleapis.com/sentral-news-media/'
        'back-img.jpeg';
    }
  }

  ngOnInit() {
    let myWis = this.winRef.nativeWindow.innerWidth - 2;
    if (myWis > 616) {
      myWis = 616;
    }
    this.listStyle = {
      width: `${myWis / 2}px`,
    };
  }

  get prof_url(): string {
    return this._prof_url;
  }

  set prof_url(value: string) {
    this._prof_url = value;
  }

  get back_url(): string {
    return this._back_url;
  }

  set back_url(value: string) {
    this._back_url = value;
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  manageFollow() {
    if (!this.folli) {
      this.userService
        .manageFollowingTag('@' + this._user.id, true)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((value) => {
          this.folli = value;
          // this.userService.dbUser?.users.push(this._user.id);
          this.userService.newsCo
            .get(this.userService.links[2])
            ?.push('@' + this._user.id);
          this.renderer.setProperty(
            this.followButton.nativeElement,
            'innerHTML',
            'Takip Kes'
          );
        });
    } else {
      this.userService
        .manageFollowingTag('@' + this._user.id, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((value) => {
          this.folli = !value;
          const ind = this.userService.dbUser?.users.indexOf(this._user.id);
          console.log('prof ind: ', ind);
          if (ind !== undefined) {
            // this.userService.dbUser?.users.splice(ind, 1);
            this.userService.newsCo
              .get(this.userService.links[2])
              ?.splice(ind, 1);
            this.renderer.setProperty(
              this.followButton.nativeElement,
              'innerHTML',
              'Takip Et'
            );
          }
        });
    }
  }
  // onClick(url, newsOwnerId) {
  //     this.router.navigateByUrl(url, { relativeTo: this.route, state: { userID: '@' + newsOwnerId, loggedID: this.userService.loggedUser ? this.userService.loggedUser.id : ''},});
  // }
  getUrl() {
    return this.user.id === this.userService.loggedUser?.id
      ? '/user'
      : '/allusers/user/' + this.user.username;
  }
}
