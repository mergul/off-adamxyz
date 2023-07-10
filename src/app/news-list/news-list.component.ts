import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { NewsService } from '../core/news.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NewsPayload } from '../core/news.model';
import { Location } from '@angular/common';
import { map, takeUntil } from 'rxjs/operators';
import { WindowRef } from '../core/window.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit, OnDestroy, AfterViewInit {
  public state = '';
  public thumbName;
  private newsBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);
  newsList$ = this.newsBehaviorSubject.asObservable();
  _orderBy = 'count';
  currentPage = 0;
  currentOffset = 0;
  isUp = false;
  newsListCounts = 0;
  private unsubscriber$: Subject<boolean> = new Subject<boolean>();
  destroy = new Subject();
  destroy$ = this.destroy.asObservable();
  private _currLink!: string;
  prevOffset = 0;
  thumbHeight = 109;
  fontSize = 12;
  height = 109;
  private _newsList!: Observable<NewsPayload[]>;
  list!: NewsPayload[];
  othersList$!: NewsPayload[];
  @ViewChildren('newsSum', { read: ElementRef })
  newsSum!: QueryList<ElementRef>;
  private _percentage: number = 0;

  constructor(
    private newsService: NewsService,
    public location: Location,
    private renderer: Renderer2,
    private winRef: WindowRef
  ) {}
  ngAfterViewInit(): void {
    if (
      !this.newsService.isConnected &&
      this.location.isCurrentPathEqualTo('/home') &&
      (this.newsService.preList.length === 0 ||
        this.activeLink === this.currLink)
    ) {
      const ind = this.newsService.links.indexOf(this.activeLink);
      this.winRef.nativeWindow.document
        .querySelectorAll('.news-list')
        .forEach((item) => {
          if (item.offsetLeft == ind * 617) item.classList.add('shadow');
          else item.classList.remove('shadow');
        });
    }
    this.newsSum.changes.pipe(takeUntil(this.destroy$)).subscribe((comps) => {
      if (
        this.newsService.links.includes(this.activeLink) &&
        this.newsService.prevLink !== -1
      ) {
        if (this.currentOffset === 0 && this.newsService.preList.length < 3) {
          this.newsService.preList.push(comps.toArray());
        } else {
          this.newsService.preList.splice(
            this.newsService.links.indexOf(this.activeLink),
            1,
            comps.toArray()
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.unsubscriber$.unsubscribe();
  }
  @Input()
  get activeLink(): string {
    return this.newsService.activeLink;
  }
  @Input()
  get currLink(): string {
    return this._currLink;
  }

  set currLink(value: string) {
    this._currLink = value;
  }
  @Input()
  get percentage(): number {
    return this._percentage;
  }

  set percentage(value: number) {
    this.isUp = value > this._percentage;
    this._percentage = value;
    if (
      this.isUp &&
      !this.unsubscriber$.closed &&
      this.newsBehaviorSubject.getValue().length > 4
    ) {
      this.currentPage++;
      this.getStories();
    }
  }
  set activeLink(value: string) {
    if (value !== null && value && !this.newsService.activeLink) {
      this.newsService.activeLink = value;
    }
  }

  @Input()
  get newsList(): Observable<NewsPayload[]> {
    return this.newsList$;
  }
  set newsList(value: Observable<NewsPayload[]>) {
    if (value) {
      this._newsList = value;
      this.currentPage = 1;
      this.getStories();
    }
  }
  getStories = () => {
    this._newsList
      .pipe(
        takeUntil(this.destroy$),
        map((x) => {
          if (x.length > 5 && !this.unsubscriber$.closed) {
            if (this.currentPage > 1 && x.length < this.currentPage * 5) {
              this.unsubscriber$.next(true);
              this.unsubscriber$.unsubscribe();
              this.currentPage = 1;
              this.newsBehaviorSubject.next(x);
              console.log('stopped to listen --> ' + this.prevOffset);
            } else {
              this.newsBehaviorSubject.next(x.slice(0, 5 * this.currentPage));
            }
          } else if (x.length > 0) {
            this.newsBehaviorSubject.next(x);
          }
          return this.newsList$;
        })
      )
      .subscribe();
  };

  ngOnInit() {
    this.state = window.history.state
      ? window.history.state.userID
      : this.state;
    if (this.winRef.nativeWindow.innerWidth < 1080) {
      this.height = this.thumbHeight * (4 / 5);
      this.thumbHeight = this.height - 19;
      this.fontSize = 9;
    } else {
      this.thumbHeight = this.thumbHeight - 19;
    }
    if (
      this.location.isCurrentPathEqualTo('/home') &&
      this.newsService.endPlayer.observers.length === 0
    ) {
      if (this.currLink === this.activeLink) {
        this.newsService.endPlayer
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            const index = this.newsService.links.indexOf(
              this.newsService.activeLink
            );
            if (this.newsService.preList.length > 0) {
              this.newsService.preList.forEach((items, ind) => {
                if (ind === index) {
                  if (items[0].nativeElement.isConnected) {
                    items.forEach((item) =>
                      this.renderer.addClass(item.nativeElement, 'shadow')
                    );
                  } else {
                    this.winRef.nativeWindow.document
                      .querySelectorAll('.news-list')
                      .forEach((item, indx) => {
                        if (item.offsetLeft == ind * 617)
                          item.classList.add('shadow');
                      });
                  }
                } else {
                  if (items[0].nativeElement.isConnected) {
                    items.forEach((item) =>
                      this.renderer.removeClass(item.nativeElement, 'shadow')
                    );
                  } else {
                    this.winRef.nativeWindow.document
                      .querySelectorAll('.news-list')
                      .forEach((item, indx) => {
                        if (item.offsetLeft == ind * 617) {
                          item.classList.remove('shadow');
                        }
                      });
                  }
                }
              });
            } else {
              const ind = this.newsService.links.indexOf(this.activeLink);
              this.winRef.nativeWindow.document
                .querySelectorAll('.news-list')
                .forEach((item) => {
                  if (item.offsetLeft == ind * 617)
                    item.classList.add('shadow');
                  else item.classList.remove('shadow');
                });
            }
          });
      }
    }
  }

  get newsCounts(): Map<string, string> {
    return this.newsService.newsCounts;
  }

  byId(index: number, item: NewsPayload) {
    if (!item) {
      return '0';
    }
    return item.newsId;
  }
}
