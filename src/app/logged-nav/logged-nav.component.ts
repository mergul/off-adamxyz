import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { UserService } from '../core/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NewsService } from '../core/news.service';
import { ReactiveStreamsService } from '../core/reactive-streams.service';
import { WindowRef } from '../core/window.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-logged-nav',
  templateUrl: './logged-nav.component.html',
  styleUrls: ['./logged-nav.component.scss'],
})
export class LoggedNavComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  @Output() logChange: EventEmitter<Observable<boolean>>;
  toolbarStyle = {};
  _isOpen = false;
  opens!: HTMLElement;
  closes!: HTMLElement;

  private _logged: boolean | null = null;
  checkMedia = false;
  constructor(
    public newsService: NewsService,
    private winRef: WindowRef,
    public service: UserService,
    private location: Location,
    private router: Router,
    public authService: AuthService,
    private reactiveService: ReactiveStreamsService
  ) {
    this.logChange = this.authService.changeEmitter;
  }

  @Input()
  get logged(): boolean | null {
    return this._logged;
  }
  set logged(value: boolean | null) {
    this._logged = value;
  }
  @Input()
  get isOpen(): boolean {
    return this._isOpen;
  }
  set isOpen(value: boolean) {
    this._isOpen = value;
  }
  get image(): string {
    return this.service.prof_url;
  }
  get role() {
    if (this.service.dbUser) {
      return this.service.dbUser.roles[0];
    }
    return 'ROLE_USER';
  }
  ngOnInit() {
    this.checkMedia = this.winRef.nativeWindow.innerWidth < 600;
  }
  btnClick(url: string) {
    if (this.checkMedia) document.getElementById('hamburger')?.click();
    console.log('this.location.path: ', this.location.path());
    this.newsService.preModalUrl = this.location.path();
    const purl = this.router.url;
    if (purl.includes(url) && url !== '/user')
      this.router
        .navigateByUrl(this.newsService.preModalUrl, {
          skipLocationChange: true,
        })
        .then(() => {
          this.router.navigate([purl]);
        });
    else
      this.router.navigateByUrl(
        url == '/upload' ? this.newsService.preModalUrl + url : url,
        {
          state: { loggedID: this.service._loggedUser?.id },
        }
      );
  }
  logout() {
    this.changeChild(false);
    if (this.router.url === '/home' || this.router.url === '/user') {
      this.newsService.callToggle.next(
        this.newsService.links.indexOf(this.newsService.activeLink)
      );
      this.newsService.callTag.next(this.newsService.links[0]);
    }
    setTimeout(() => {
      this.authService.doLogout().then(
        () => {
          this.service._loggedUser = undefined;
          this.service.user = undefined;
          this.reactiveService.resetNavListListeners(
            '@' + this.service.dbUser?.id
          );
          if (this.service.dbUser) {
            for (const tag of this.service.dbUser.tags) {
              this.reactiveService.resetUserListListeners('#' + tag);
            }
            for (const tag of this.service.dbUser.users) {
              this.reactiveService.resetUserListListeners('@' + tag, true);
            }
          }
          this.service.dbUser = undefined;
          this.service.newsCo.clear();
          this.newsService.activeLink = this.newsService.links[0];
          this.router.navigateByUrl('/home');
        },
        () => {}
      );
    }, 50);
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  changeChild(value: boolean) {
    this.logChange.emit(of(value));
    console.log('changeChild --> ' + value);
  }
}
