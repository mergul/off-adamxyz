import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NewsService } from '../core/news.service';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-money-manage',
  templateUrl: './money-manage.component.html',
  styleUrls: ['./money-manage.component.scss'],
})
export class MoneyManageComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  adListStyle = {};
  searchField!: FormControl;
  searchForm!: FormGroup;
  @Output() boolChange = new EventEmitter<Observable<number>>();
  private _boolUser!: Observable<number>;
  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({});
    this.searchField = new FormControl();
  }
  @Input()
  get boolUser(): Observable<number> {
    return this._boolUser;
  }

  set boolUser(value: Observable<number>) {
    this._boolUser = value;
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  partitionMoney(value: number) {
    if (!value || value === 0) {
      alert('Hatalı İşlem!');
    } else {
      this.newsService
        .partitionMoney(value)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this._snackBar.open(
            'Money Partition request finished and returned!!!',
            'Check results!',
            {
              duration: 3000,
            }
          );
        });
      this._snackBar.open('Your request sent successfully!', 'Check results!', {
        duration: 3000,
      });
      this.searchField.patchValue(0);
    }
  }
  changeChild() {
    this.boolChange.emit(of(6));
  }
}
