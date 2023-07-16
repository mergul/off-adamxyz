import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, Subscription, Subject } from 'rxjs';
import { NewsService } from '../core/news.service';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { News, NewsPayload, OfferPayload } from '../core/news.model';
import { UserService } from '../core/user.service';
import { Location } from '@angular/common';
import { FirebaseUserModel, User } from '../core/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { WindowRef } from '../core/window.service';
import { AuthService } from '../core/auth.service';
import { ReactiveStreamsService } from '../core/reactive-streams.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public.profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private readonly onDestroy = new Subject<void>();
  _isPub = of(true);
  private _prof_url = '/assets/profile-img.jpeg';
  private _back_url = '/assets/back-img.jpeg';
  _userIds: string[] = [];
  folli: boolean = false;
  followee!: Observable<boolean>;
  private _tags!: Observable<Array<string>>;
  subscription_newslist: Subscription = new Subscription();
  isMobile = false;
  _user!: Observable<User | null>;
  _username!: string;
  orderBy = 'date';
  userID!: string;
  _boolUser: Observable<number> = of(0);
  controller = new AbortController();
  signal = this.controller.signal;
  public loggedID = '';
  listStyle = {};
  compStyle = {};
  private newslistUrl: string;
  public myUser!: User;
  private myInput!: ElementRef;
  @ViewChild('myInput', { static: false })
  public set value(v: ElementRef) {
    if (v) {
      this.myInput = v;
      this.renderer.addClass(this.myInput.nativeElement, 'active');
    }
  }
  constructor(
    public userService: UserService,
    private reactiveService: ReactiveStreamsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public location: Location,
    private winRef: WindowRef,
    private renderer: Renderer2,
    public service: NewsService,
    public domSanitizer: DomSanitizer
  ) {
    if (!this.reactiveService.random) {
      this.reactiveService.random =
        Math.floor(Math.random() * (999999 - 100000)) + 100000;
    }
    this.newslistUrl =
      '/sse/chat/room/TopNews' +
      this.reactiveService.random +
      '/subscribeMessages';
    // this.followee = userService._me.pipe(
    //   takeUntil(this.onDestroy),
    //   map((user) => user != null && user.users.includes(this.myUser.id))
    // );
  }
  @Input()
  get username(): string {
    return this._username;
  }
  set username(value: string) {
    this._username = value;
  }
  get newsCounts(): Map<string, string> {
    return this.service.newsCounts;
  }
  ngOnInit() {
    if (!this.reactiveService.statusOfNewsSource()) {
      this.reactiveService.getNewsStream(
        this.reactiveService.random,
        this.newslistUrl
      );
    }
    this.loggedID = window.history.state.loggedID;
    this._username = window.history.state.userID;
    this._user = this.userService._otherUser;
    const myWis = this.winRef.nativeWindow.innerWidth;
    const mwidth = 62;
    let rght = '0px';
    let lft = '0px';
    this.isMobile = this.winRef.nativeWindow.innerWidth < 620;
    if (this.isMobile) {
      lft = `${myWis > 390 ? (myWis - 390) / 2 : myWis / 20}px`;
      rght = `${myWis > 390 ? (3 * myWis) / 350 : myWis / 20}px`;
    } else {
      rght = `${(3 * myWis) / 350}px`;
    }
    this.listStyle = {
      minWidth: this.isMobile ? `auto` : `390px`,
      marginRight: rght,
      marginLeft: lft,
    };
    this.compStyle = {
      width:
        myWis > 1050
          ? `${(((myWis * 2) / 3) * myWis) / 1600}px`
          : !this.isMobile
          ? `${mwidth}vw`
          : '100vw',
      overflow: 'hidden',
      marginTop: '17px',
    };
    this.route.paramMap
      .pipe(
        takeUntil(this.onDestroy),
        switchMap((params: ParamMap) => {
          const jgh = params.get('id');
          if (jgh) this._username = jgh;
          this.username = this._username.includes('@')
            ? this._username
            : '#' + this._username;
          return this.findMother();
        }),
        switchMap((otherUser) => {
          this.reactiveService.setOtherListener('@' + this.userID);
          const listim = this.reactiveService.publicStreamList$.get(
            this.userID
          );
          if (listim) {
            this.reactiveService.getNewsSubject('other').next(listim);
            const offers = this.reactiveService.publicOfferList$.get(
              this.userID
            );
            if (offers)
              this.reactiveService.getOffersSubject('other').next(offers);
          }
          return this.service.setNewsUser(
            '@' + this.userID,
            this.reactiveService.random
          );
        })
      )
      .subscribe((asw) => {
        console.log('findMother : ', asw);
      });
  }

  tagClick(user: User) {
    if (!this.folli) {
      this.userService
        .manageFollowingTag('@' + user.id, true)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((value) => {
          this.folli = value;
          if (this.userService.dbUser) {
            user.followers.push(this.userService.dbUser.id);
            this.userService.dbUser.users.push(user.id);
            this.userService.newsCo
              .get(this.userService.links[2])
              ?.push('@' + user.id);
            this._user = of(user);
          }
        });
    } else {
      this.userService
        .manageFollowingTag('@' + user.id, false)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((value) => {
          this.folli = !value;
          if (this.userService.dbUser) {
            const ind = user.followers.indexOf(this.userService.dbUser.id);
            user.followers.splice(ind, 1);
            this.userService.dbUser.users.splice(
              this.userService.dbUser.users.indexOf(user.id),
              1
            );
            this.userService.newsCo
              .get(this.userService.links[2])
              ?.splice(ind, 1);
            this._user = of(user);
          }
        });
    }
  }

  getNewsByOwner(userId: string): Observable<Array<News>> {
    this.orderBy = 'date';
    return this.service.getNewsByOwnerId(userId);
  }
  ngAfterViewInit(): void {
    if (!this.userService.loggedUser && !this._username) {
      this.authService
        .getCurrentUser()
        .then((value) => {
          if (value) {
            this.userService.user = new FirebaseUserModel();
            this.userService.user.image = value.providerData[0].photoURL;
            this.userService.user.email = value.providerData[0].email;
            this.userService.user.name = value.displayName;
            this.userService.user.id = value.uid;
            this.userService.user.token = value['ra'];
            value.getIdToken().then((idToken) => {
              if (this.userService.user) this.userService.user.token = idToken;
            });
            this.userService.loggedUser = this.userService.user;
            this.loggedID = this.loggedID
              ? this.loggedID
              : value.uid.substring(0, 12);
            if (!this.userService._otherUser) {
              this.findMother()
                .toPromise()
                .then((a) => {
                  this.reactiveService.setOtherListener('@' + this.userID);
                  const listim = this.reactiveService.publicStreamList$.get(
                    this.userID
                  );
                  if (listim) {
                    this.reactiveService.getNewsSubject('other').next(listim);
                  }
                  return this.service
                    .setNewsUser('@' + this.userID, this.reactiveService.random)
                    .toPromise();
                })
                .then((a) => console.log('findMother : ', a));
            }
          }
        })
        .catch((reason) => {
          this.loggedID = '';
          if (!this.userService._otherUser) {
            this._user = this.userService._otherUser = this.findMother();
          }
        });
    }
  }
  ngOnDestroy() {
    if (!this.location.path().includes('/allusers')) {
      this.userService._otherUser = of(null);
    }
    this.onDestroy.next();
    this.onDestroy.complete();
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
  get boolUser(): Observable<number> {
    return this._boolUser;
  }

  set boolUser(value: Observable<number>) {
    this._boolUser = value;
  }
  proClick(people: string[]) {
    this.renderer.removeClass(this.myInput.nativeElement, 'active');
    this._userIds = people;
    this.boolUser = of(2);
  }

  roleClick(userd: User) {
    if (userd.roles.includes('ROLE_USER')) {
      userd.roles = ['ROLE_MODERATOR'];
    } else {
      userd.roles = ['ROLE_USER'];
    }
    this.userService
      .updateUser(userd)
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }

  deleteClick(userd: User) {
    this.userService
      .deleteUser(userd)
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }
  blockClick(userd: User) {
    if (this.userService.dbUser)
      this.userService
        .blockUser(userd, this.userService.dbUser.blocked.includes(userd.id))
        .pipe(takeUntil(this.onDestroy))
        .subscribe();
  }
  private findMother(): Observable<User | null> {
    // if (this.userService._otherUser) { return this._user;} else {
    const url =
      '/api/rest/users/get/' +
      encodeURIComponent(this._username) +
      '/' +
      (this.loggedID ? this.loggedID : 'a') +
      '/' +
      this.reactiveService.random;
    return this.userService.getDbUser(url).pipe(
      map((user) => {
        if (user.id) {
          this.userID = user.id;
          const leng = user.mediaParts.length;
          user.mediaParts.forEach((thumb) => {
            const img = thumb === 1 ? 'back-img.jpeg' : 'profile-img.jpeg';
            if (thumb === 1) {
              this.back_url =
                'https://storage.googleapis.com/sentral-news-media/' +
                user.id +
                '-' +
                img;
              if (leng === 1) {
                this.prof_url =
                  'https://storage.googleapis.com/sentral-news-media/' + img;
              }
            } else if (thumb === 0) {
              this.prof_url =
                'https://storage.googleapis.com/sentral-news-media/' +
                user.id +
                '-' +
                img;
              if (leng === 1) {
                this.back_url =
                  'https://storage.googleapis.com/sentral-news-media/' + img;
              }
            }
          });
          if (leng === 0) {
            this.prof_url =
              '/assets/' + // 'https://storage.googleapis.com/sentral-news-media/'
              'profile-img.jpeg'; // this.loggedUser.image;
            this.back_url =
              '/assets/' + // 'https://storage.googleapis.com/sentral-news-media/'
              'back-img.jpeg';
          }
          this.folli =
            this.userService.loggedUser != null &&
            this.userService.loggedUser.people.includes(user.id);
          this.boolUser = of(0);
        } else {
          this.prof_url =
            'https://storage.googleapis.com/sentral-news-media/' +
            'profile-img.jpeg';
          this.back_url =
            'https://storage.googleapis.com/sentral-news-media/' +
            'back-img.jpeg';
          this.boolUser = of(0);
          return null;
        }
        this.myUser = user;
        this._user = this.userService._otherUser = of(user);
        return user;
      })
    );
    //   }
  }
  get tags(): Observable<Array<string>> {
    return this._tags;
  }

  set tags(value: Observable<Array<string>>) {
    this._tags = value;
  }
  followTags(tagst: string[]) {
    this.tags = of(tagst);
    this.boolUser = of(3);
    this.renderer.removeClass(this.myInput.nativeElement, 'active');
  }
  contents() {
    this.boolUser = of(0);
  }
  mineOffers() {
    this.boolUser = of(8);
  }
  getContentsCount(userd: User) {
    return this.reactiveService.publicStreamList$.get(userd.id)?.length;
  }
  getPeopleOffers(): number {
    return this.reactiveService.getOffersSubject('other').value.length;
  }
  getUrl(item: string, i: number) {
    let prefix = './';
    for (let index = 1; index < this.service.getPathsList().length; index++) {
      const element = this.service.getPathsList()[index];
      if (index < i) {
        prefix += element + '/';
      }
    }
    return i > 0 ? prefix + item : prefix;
  }
}
