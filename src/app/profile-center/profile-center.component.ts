import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserService } from '../core/user.service';
import { NewsService } from '../core/news.service';
import { Observable, of, Subject } from 'rxjs';
import { User } from '../core/user.model';
import { NewsPayload } from '../core/news.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ReactiveStreamsService } from '../core/reactive-streams.service';
import { WindowRef } from '../core/window.service';

@Component({
  selector: 'app-profile-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-center.component.html',
  styleUrls: ['./profile-center.component.scss'],
})
export class ProfileCenterComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private _isPub!: Observable<boolean>;
  _user!: User | undefined;
  public _newsList!: Observable<NewsPayload[]>;
  _username!: string;
  _boolUser!: Observable<number>;
  orderBy = 'date';
  _userIds: string[] = [];
  _users!: Observable<Array<User>>;
  _tagz!: Observable<Array<string>>;
  private newslistUrl: string;
  message: any;
  percentage: number = 0;
  modalWidth!: string;
  _isPublic!: boolean;

  constructor(
    public userService: UserService,
    private reactiveService: ReactiveStreamsService,
    private winRef: WindowRef,
    public service: NewsService
  ) {
    if (!this.reactiveService.random) {
      this.reactiveService.random =
        Math.floor(Math.random() * (999999 - 100000)) + 100000;
    }
    this.newslistUrl =
      '/sse/chat/room/TopNews' +
      this.reactiveService.random +
      '/subscribeMessages';
  }

  @Input()
  get user(): User | undefined {
    return this._user;
  }

  set user(value: User | undefined) {
    this._user = value;
  }
  @Input()
  get userIds(): string[] {
    return this._userIds;
  }

  set userIds(value: string[]) {
    this._userIds = value;
    if (value.length > 0) {
      this.users = this.userService.getUsers(this.userIds);
    } else {
      this.users = of([]);
    }
  }

  @Input()
  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }
  @Input()
  get boolUser(): Observable<number> {
    return this._boolUser;
  }

  set boolUser(value: Observable<number>) {
    this._boolUser = value;
  }
  @Input()
  get tagz(): Observable<Array<string>> {
    return this._tagz;
  }

  set tagz(value: Observable<Array<string>>) {
    this._tagz = value;
  }
  @Input()
  get isPub(): Observable<boolean> {
    return this._isPub;
  }

  set isPub(value: Observable<boolean>) {
    this._isPub = value;
  }
  get newsCounts(): Map<string, string> {
    return this.service.newsCounts;
  }

  ngOnInit() {
    const wid = this.winRef.nativeWindow.innerWidth;
    const wew = wid >= 908 ? 808 : wid - (100 * wid) / 908;
    this.modalWidth = '' + wew;
    if (!this.reactiveService.statusOfNewsSource()) {
      this.reactiveService.getNewsStream(
        this.reactiveService.random,
        this.newslistUrl
      );
    }
    this._isPub
      .pipe(
        takeUntil(this.onDestroy),
        switchMap((value2) => {
          this._isPublic = value2;
          if (!value2) {
            if (!this.service.meStreamList$) {
              this.service.meStreamList$ =
                this.reactiveService.getMessage('me');
            }
            this._newsList = this.service.meStreamList$;
          } else {
            this._newsList = this.reactiveService.getMessage('other-person');
          }
          return this._newsList;
        })
      )
      .subscribe();
  }

  get users(): Observable<Array<User>> {
    return this._users;
  }

  set users(value: Observable<Array<User>>) {
    this._users = value;
  }

  getNewsByOwner() {
    this.orderBy = 'date';
    this.service.setNewsList(['@' + this.user?.id], true);
  }
  getNewsByTopHundred() {
    this.orderBy = 'count';
    this.service.setNewsList(['@' + this.user?.id], true);
  }

  getNewsByOwnerOlder() {
    this.orderBy = '';
    this.service.setNewsList(['@' + this.user?.id], true);
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  receiveMessage($event) {
    this.boolUser = $event;
  }
  track(event) {
    this.percentage = event;
    //  console.log('track percentage --> '+event)
  }
  moveTop() {
    const elem = document.querySelector('.example-container') as HTMLElement;
    elem.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
