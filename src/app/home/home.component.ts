import { Observable, Subject, fromEvent, of } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Location } from '@angular/common';
import { NewsService } from '../core/news.service';
import { UserService } from '../core/user.service';
import { FirebaseUserModel } from '../core/user.model';
import { ReactiveStreamsService } from '../core/reactive-streams.service';
import { WindowRef } from '../core/window.service';
import { RecordSSE } from '../core/record.sse';
import { HammerGestureConfig } from '@angular/platform-browser';
import {
  AnimationPlayer,
  AnimationBuilder,
  AnimationFactory,
  animate,
  style,
} from '@angular/animations';
import { Router } from '@angular/router';
import { NewsPayload } from '../core/news.model';
import { Point } from '../core/Point';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy = new Subject();
  destroy$ = this.destroy.asObservable();
  twttr: any;
  @ViewChild('mytags', { static: true }) mytags!: ElementRef;
  @ViewChild('listContainer', { static: true }) listContainer!: ElementRef;
  private player!: AnimationPlayer;
  public itemWidth = 617;
  private currentSlide = 0;
  @ViewChild('carousel', { read: ElementRef, static: false }) carousel;
  isPub = of(true);
  @Input() timing = '250ms ease-in';
  carouselWrapperStyle = {};
  carouselWrapStyle = {};
  carouselPagerStyle = {};
  newsCounts$: Map<string, string> = new Map<string, string>();
  mobileQuery!: MediaQueryList;
  links = [
    'En Çok Okunanlar',
    'Takip Edilen Etiketler',
    'Takip Edilen Kişiler',
  ];
  user!: FirebaseUserModel;
  _topTags!: Observable<Array<RecordSSE>>;
  private _orderBy = 'count';
  public state$!: Observable<{ [key: string]: string }>;
  leftListStyle = {};
  rightListStyle = {};
  carouselStyle = {};
  miCarouselStyle = {};
  alive = true;
  _activeLink!: string;
  navSlide = 0;
  hght!: number;
  othersList$!: NewsPayload[];
  percentage = 0;
  ani: any;
  mediaF!: HTMLElement;
  mediaS!: HTMLElement;

  constructor(
    private reactiveService: ReactiveStreamsService,
    public service: UserService,
    private builder: AnimationBuilder,
    public location: Location,
    private router: Router,
    public newsService: NewsService,
    private winRef: WindowRef,
    private renderer: Renderer2
  ) {
    const wid = this.winRef.nativeWindow.innerWidth;
    this.itemWidth = wid > 1240 ? wid / 2 : wid < 618 ? wid : 617;
    if (this.newsService.callToggle.observers.length === 0) {
      this.newsService.callToggle
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          // console.log('move to --> ' + data + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser);
          this.navSlide = data;
          const index = this.links.indexOf(this.newsService.activeLink);
          this.currentSlide =
            index === -1 ||
            this.links[this.currentSlide] === this.newsService.activeLink
              ? this.currentSlide
              : index;
          // console.log('move to --> ' + data + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: index --> ' + index);
          this.onNavClick(
            this.loggedUser ? this.newsService.activeLink : this.links[-data],
            index
          );
        });
    }
  }
  track(event: number) {
    // const eleme = document.querySelector('.img-hat') as HTMLElement;
    const mas = Math.round(event);
    this.percentage = mas;
    // if (!this.ani) {
    //   this.ani = eleme.animate(
    //     { opacity: ['0.1', '0.5', '0.1'], easing: ['ease-in', 'ease-in'] },
    //     1500
    //   );
    //   setTimeout(() => {
    //     this.ani = null;
    //   }, 2000);
    // }
  }
  ngOnInit() {
    //   this.hght = this.winRef.nativeWindow.innerHeight * 2;
    const myWis = this.winRef.nativeWindow.innerWidth;
    if (myWis < 617) {
      this.itemWidth = myWis;
    }
    this.leftListStyle = {
      width: `${(myWis - this.itemWidth) / 2}px`,
      paddingLeft: myWis < 917 ? `0px` : `${(myWis - this.itemWidth) / 6}px`,
      display: myWis < 817 ? 'none' : 'inline-block',
    };
    this.rightListStyle = {
      width: `${(myWis - this.itemWidth) / 2}px`,
      paddingRight: myWis < 917 ? `0px` : `${(myWis - this.itemWidth) / 6}px`,
      display: myWis < 817 ? 'none' : 'inline-block',
    };
    this.miCarouselStyle = {
      width: `${this.itemWidth}px`,
    };
    this.carouselStyle = {
      minWidth: `${this.itemWidth}px`,
      marginLeft:
        myWis < 817 && myWis > 617
          ? `${(myWis - this.itemWidth) / 2}px`
          : `0px`,
    };
    this.carouselWrapStyle = {
      width: `${this.itemWidth * this.links.length}px`,
    };
    if (
      !this.activeLink ||
      (!this.links.includes(this.activeLink) &&
        !this.activeLink.startsWith('#'))
    ) {
      this.activeLink = this.links[0];
    }
    const hammerConfig = new HammerGestureConfig();
    const hammer = hammerConfig.buildHammer(this.listContainer.nativeElement);
    fromEvent(hammer, 'swipe')
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: any) => {
        if (this.loggedUser) {
          if (res.deltaX > 0) {
            this.prev();
            this.newsService.callTag.next(this.links[this.currentSlide]);
          } else {
            this.next();
            this.newsService.callTag.next(this.links[this.currentSlide]);
          }
        } else if (res.deltaX < 0) {
          this.service.redirectUrl = '/home';
          this.newsService.activeLink = this.links[1];
          this.router.navigate(['/loginin']);
        }
      });
  }
  get orderBy(): string {
    return this._orderBy;
  }

  set orderBy(value: string) {
    this._orderBy = value;
  }

  get activeLink(): string {
    return this.newsService.activeLink;
  }

  set activeLink(value: string) {
    this.newsService.activeLink = value;
  }

  get loggedUser(): FirebaseUserModel | undefined {
    return this.service.loggedUser;
  }

  get newsCounts(): Map<string, string> {
    return this.newsService.newsCounts;
  }

  set newsCounts(newCounts: Map<string, string>) {
    this.newsService.newsCounts = this.newsCounts$;
  }

  get newsCo(): Map<string, Array<string>> {
    return this.service.newsCo;
  }
  moveTop() {
    const elem = document.querySelector('.example-container') as HTMLElement;
    elem.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  // receiveMsg($event, index) {
  //     if (this.links.indexOf(this.activeLink)===index) {
  //     this._scrolled = $event;
  //     console.log('receiveMsg --> '+index);
  //     }
  //   }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onNavClick(link: string, index = 0) {
    if (index === -1) {
      if (!this.loggedUser) {
        if (this.navSlide === 0) {
          this.reactiveService
            .getNewsSubject('main')
            .next(this.newsService.list$);
          this.newsService.activeLink = this.links[this.currentSlide];
          this.newsService.callTag.next(this.activeLink);
          //   console.log('first move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
        } else {
          //   console.log('second move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
          this.service.redirectUrl = '/home';
          this.newsService.activeLink = link;
          this.reactiveService
            .getNewsSubject('main')
            .next(this.newsService.list$);
          this.router.navigate(['/loginin']);
        }
      } else {
        if (this.navSlide === 0) {
          this.reactiveService
            .getNewsSubject('main')
            .next(this.newsService.list$);
          this.newsService.activeLink = this.links[this.currentSlide];
          this.newsService.callTag.next(this.activeLink);
          //  console.log('third move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
        } else {
          //  console.log('fourth move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
          let milink = this.links.indexOf(this.newsService.activeLink);
          this.newsService.activeLink = link;
          if (milink === -1) {
            this.reactiveService
              .getNewsSubject('main')
              .next(this.newsService.list$);
            milink += 1;
            if (this.navSlide === 0)
              this.newsService.activeLink = this.links[0];
          }
          this.slideIn(
            this.navSlide !== 0
              ? this.navSlide
              : milink - this.links.indexOf(link)
          );
        }
      }
    } else {
      if (!this.loggedUser) {
        //  console.log('fifth move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
        this.service.redirectUrl = '/home';
        this.newsService.activeLink = link;
        if (this.newsService.list$)
          this.reactiveService
            .getNewsSubject('main')
            .next(this.newsService.list$);
        this.router.navigate(['/loginin']);
      } else {
        //  console.log('sixth move to --> ' + link + ' :: currentSlide --> ' + this.currentSlide + ' :: active --> ' + this.newsService.activeLink + ' :: is user undefined--> ' + !this.loggedUser + ' :: index --> ' + index + ' :: nav slide --> ' + this.navSlide);
        let milink = this.links.indexOf(this.newsService.activeLink);
        this.newsService.activeLink = link;
        if (milink === -1) {
          this.reactiveService
            .getNewsSubject('main')
            .next(this.newsService.list$);
          milink += 1;
          if (this.navSlide === 0) this.newsService.activeLink = this.links[0];
        }
        this.slideIn(
          this.navSlide !== 0
            ? this.navSlide
            : milink - this.links.indexOf(link)
        );
      }
    }
  }
  slideIn = (diff) => {
    while (diff !== 0) {
      if (diff < 0) {
        this.next();
        diff++;
      } else {
        this.prev();
        diff--;
      }
    }
  };
  onOfferTagClick(tag: string) {}
  onTagClick(tag: string) {
    const ind = this.links.indexOf(this.activeLink);
    if (ind > -1) {
      this.slideIn(ind);
    }
    if (!this.newsService.list$) {
      this.newsService.list$ =
        this.reactiveService.getNewsSubject('main').value;
    }
    this.othersList$ = this.newsService.list$.filter((value1) =>
      value1.topics.includes(tag)
    );
    this.reactiveService.getNewsSubject('main').next(this.othersList$);
    this.newsService.activeLink = tag;
    this.newsService.callTag.next(tag);
  }
  registerToTag(_activeLink: string) {
    if (this.service.dbUser) {
      this.service
        .manageFollowingTag(_activeLink, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value) {
            // this.service.dbUser?.tags.push(_activeLink.substring(1));
            this.service.newsCo.get(this.links[1])?.push(_activeLink);
          }
        });
    }
  }
  ngAfterViewInit(): void {
    this.mediaF = document.querySelectorAll('.media-image')[1] as HTMLElement;
    this.mediaS = document.querySelectorAll('.media-image')[2] as HTMLElement;
    this.renderer.listen(this.winRef.nativeWindow, 'dragstart', (event) => {
      event.preventDefault();
    });
    if (this.activeLink !== this.links[0] && this.loggedUser) {
      if (this.activeLink === this.links[1]) {
        this.next();
      } else if (this.activeLink === this.links[2]) {
        this.next();
        this.next();
      }
    } else {
      if (this.activeLink === this.links[1]) {
        this.onNavClick(this.activeLink);
      } else if (this.activeLink === this.links[2]) {
        this.onNavClick(this.activeLink);
        this.onNavClick(this.activeLink);
      } else if (!this.loggedUser)
        this.newsService.callTag.next(this.activeLink);
    }
  }
  next() {
    if (this.currentSlide + 1 === this.links.length) {
      return;
    }
    if (this.mediaF.style['content-visibility'] === '') {
      this.mediaF.style['content-visibility'] = 'visible';
      this.mediaS.style['content-visibility'] = 'visible';
    }
    this.currentSlide = (this.currentSlide + 1) % this.links.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(
      this.carousel.nativeElement.isConnected
        ? this.carousel.nativeElement
        : this.winRef.nativeWindow.document.querySelector('.carousel-inner')
    );
    this.player.onDone(() => {
      //  console.log('player is done next animation --> ' + this.player.getPosition());
      this.newsService.endPlayer.next(true);
    });
    this.player.play();
    this.newsService.activeLink = this.links[this.currentSlide];
  }
  private buildAnimation(offset) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` })),
    ]);
  }
  prev() {
    if (this.currentSlide === 0) {
      return;
    }
    this.currentSlide = this.currentSlide - 1;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(
      this.carousel.nativeElement.isConnected
        ? this.carousel.nativeElement
        : this.winRef.nativeWindow.document.querySelector('.carousel-inner')
    );
    this.player.onDone(() => {
      // console.log('player is done prev animation --> ' + this.player.totalTime);
      this.newsService.endPlayer.next(true);
    });
    this.player.play();
    this.newsService.activeLink = this.links[this.currentSlide];
  }
  currentDiv(n: number) {
    this.currentSlide = n;
    const offset = n * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }
  getLink(tag: string) {
    return of([tag.substring(1)]);
  }
}
