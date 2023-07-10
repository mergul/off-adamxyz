import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { UserService } from '../core/user.service';
import { takeUntil } from 'rxjs/operators';
import { BalanceRecord } from '../core/user.model';
import { of, Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../core/user.model';

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.scss'],
})
export class AccountHistoryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _booled!: boolean;
  loggedUser!: User | undefined;
  balance!: number;
  private readonly onDestroy = new Subject<void>();
  history: Observable<BalanceRecord[]> = of([]);
  dataSource!: MatTableDataSource<BalanceRecord>;
  displayedColumns: string[] = [
    'pageviews',
    'payment',
    'totalViews',
    'payedViews',
    'totalBalance',
    'date',
  ];
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private userService: UserService) {
    this.userService._historyBalance
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          //     (document.querySelector('button.mat-sort-header-button') as HTMLElement).click();
        });
      });
  }

  @Input()
  get booled(): boolean {
    return this._booled;
  }

  set booled(value: boolean) {
    this._booled = value;
  }
  ngOnInit(): void {
    this.loggedUser = this.userService.dbUser;
    this.balance = this.userService._totalBalance;
  }
  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  ngAfterViewInit() {}
  checkOut() {
    if (this.loggedUser)
      this.userService
        .checkOut(this.loggedUser)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((q) => alert(q + '---Talebiniz Alındı!'));
  }
}
