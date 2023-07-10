import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../core/news.service';
import { UserService } from '../core/user.service';
import { News } from '../core/news.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-news-manage',
  templateUrl: './news-manage.component.html',
  styleUrls: ['./news-manage.component.scss'],
})
export class NewsManageComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  _news!: News;
  constructor(
    public userService: UserService,
    private newsService: NewsService
  ) {}

  ngOnInit() {}
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  @Input()
  get news() {
    return this._news;
  }

  set news(news: News) {
    this._news = news;
  }

  manageNews() {
    this.newsService
      .deleteNewsById(this._news.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => {});
  }
}
