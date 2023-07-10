import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  takeUntil,
} from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { SearchService } from '../core/search.service';
import { NewsService } from '../core/news.service';
import { NewsPayload } from '../core/news.model';
import { User } from '../core/user.model';
import { WindowRef } from '../core/window.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterContentInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  newsSubject: BehaviorSubject<NewsPayload[]> = new BehaviorSubject<
    NewsPayload[]
  >([]);
  usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  newsResults!: Observable<Array<any>>;
  usersResults!: Observable<Array<any>>;
  searchField!: FormControl;
  searchForm!: FormGroup;
  searchType!: number;
  links: string[] = ['Kullanıcılar', 'Içerikler'];
  lastTerm!: string;
  wdth!: number;
  @ViewChild('myInput')
  myInput!: ElementRef;
  @ViewChild('mySelect')
  mySelect!: ElementRef;
  hght!: number;
  public _activeLink!: string;
  public miLink: string;
  percentage: number = 0;

  constructor(
    private searchService: SearchService,
    private winRef: WindowRef,
    private fb: FormBuilder,
    private newsService: NewsService
  ) {
    this.miLink = this.newsService.activeLink
      ? this.newsService.activeLink
      : this.newsService.links[0];
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.myInput.nativeElement.focus();
    }, 0);
  }

  ngOnInit() {
    this.searchForm = this.fb.group({});
    this.searchField = new FormControl();
    this._activeLink = this.links[0];
    this.doJob();
    this.newsResults = this.newsSubject.asObservable();
    this.usersResults = this.usersSubject.asObservable();
    this.wdth = this.winRef.nativeWindow.innerWidth;
    this.wdth = this.wdth > 620 ? 620 : this.wdth;
    this.hght = this.winRef.nativeWindow.innerHeight * 2;
  }

  doSearch(term: string): Observable<any[]> {
    this.searchType = this._activeLink === this.links[0] ? 0 : 1;
    this.lastTerm =
      term.charAt(0) === '@' || term.charAt(0) === '#'
        ? term.substring(1)
        : term;
    switch (this.searchType) {
      case 0:
        return this.searchService.searchPeople(this.lastTerm);
      case 1:
        return this.searchService.searchNews(this.lastTerm);
      default:
        return this.searchService.searchPeople(this.lastTerm);
    }
  }

  onClick(link: any) {
    if (link instanceof EventTarget)
      this._activeLink = this.links[this.mySelect.nativeElement.selectedIndex];
    else {
      this.mySelect.nativeElement.selectedIndex = this.links.indexOf(link);
      this._activeLink = link;
    }
    if (this.lastTerm) {
      this.searchType = this.mySelect.nativeElement.selectedIndex;
      this.doSearch(this.lastTerm)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((bv) =>
          this.searchType === 0
            ? this.usersSubject.next(bv)
            : this.newsSubject.next(bv)
        );
    }
  }

  private doJob() {
    return this.searchField.valueChanges
      .pipe(
        takeUntil(this.onDestroy),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => this.doSearch(term)),
        map((bb) =>
          this._activeLink === this.links[1]
            ? this.newsSubject.next(bb)
            : this.usersSubject.next(bb)
        )
      )
      .subscribe();
  }
  track(event) {
    this.percentage = event;
    // console.log('track percentage --> '+event)
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
