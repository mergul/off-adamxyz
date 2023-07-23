import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChildren,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../core/news.service';
import { WindowRef } from '../core/window.service';
import { Subject, of, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-no-logged-nav',
  templateUrl: './no-logged-nav.component.html',
  styleUrls: ['./no-logged-nav.component.scss'],
})
export class NoLoggedNavComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  _loggedinUser = of(false);
  toolbarStyle!: {
    marginLeft: string;
    maxWidth: string;
    minWidth: string;
  };
  checkMedia = false;
  @ViewChild('mainput', { static: true }) mainput!: ElementRef;
  public isOpen = false;
  @ViewChildren('buttons', { read: ElementRef })
  buttons!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    public winRef: WindowRef,
    public newsService: NewsService,
    private location: Location,
    private renderer: Renderer2,
    public authService: AuthService
  ) {
    this.newsService.callTag
      .pipe(takeUntil(this.onDestroy))
      .subscribe((tag) => {
        this.navChange(tag);
      });
  }
  @Input()
  get loggedinUser(): Observable<boolean> {
    return this._loggedinUser;
  }
  set loggedinUser(value: Observable<boolean>) {
    this._loggedinUser = value;
  }
  ngOnInit() {
    this.checkMedia = this.winRef.nativeWindow.innerWidth > 600;
  }
  btnClick(url: string) {
    if (url === '/home') {
      this.newsService.isConnected = false;
      console.log('thats it ---> false');
      this.router.navigateByUrl(url);
    } else this.router.navigateByUrl(url);
  }
  navChange(link: string) {
    const ind = this.newsService.links.indexOf(link);
    const curr = this.newsService.links.indexOf(
      this.newsService.activeLink &&
        this.newsService.links.indexOf(this.newsService.activeLink) !== -1
        ? this.newsService.activeLink
        : this.newsService.links[0]
    );
    this.buttons.forEach((el, index) => {
      if (ind === index) {
        this.renderer.addClass(el.nativeElement, 'active');
      } else {
        this.renderer.removeClass(el.nativeElement, 'active');
      }
    });
    return curr - ind;
  }
  navClick(link: string) {
    const myUrl = this.location.path();
    if (link !== this.activeLink || myUrl !== '/home') {
      const ind = this.navChange(link);
      if (myUrl !== '/home') {
        this.newsService.activeLink = link;
        this.newsService.isConnected = false;
        this.router.navigateByUrl('/home');
      } else this.newsService.callToggle.next(ind);
    }
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  get activeLink(): string {
    return this.newsService.activeLink;
  }
  set activeLink(value: string) {
    this.newsService.activeLink = value;
  }
  receiveMessage($event) {
    this._loggedinUser = $event;
    console.log('receiveMessage --> ' + JSON.stringify($event));
  }

  onMenu() {
    this.isOpen = this.mainput.nativeElement.checked;
  }
}
