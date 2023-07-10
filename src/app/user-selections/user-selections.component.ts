import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { UserService } from '../core/user.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BalanceRecord } from '../core/user.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { ReactiveStreamsService } from '../core/reactive-streams.service';

@Component({
  selector: 'app-user-selections',
  templateUrl: './user-selections.component.html',
  styleUrls: ['./user-selections.component.scss'],
})
export class UserSelectionsComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private _booled: boolean = false;
  selectedList: Array<BalanceRecord> = [];
  idList!: string[];
  _selected!: MatListOption[];
  clientForm: FormGroup;

  @ViewChild('users', { static: false })
  private users!: MatSelectionList;

  constructor(
    public service: UserService,
    private reactiveService: ReactiveStreamsService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      myOtherControl: new FormControl([]),
    });
  }

  ngOnInit() {}
  @Input()
  get booled(): boolean {
    return this._booled;
  }

  set booled(value: boolean) {
    this._booled = value;
  }
  onSelection($event: MatSelectionListChange, selected: MatListOption[]) {
    this._selected = $event.option.value;
  }

  deselectusers() {
    this.users.deselectAll();
  }

  payMe() {
    this.selectedList = this.clientForm.controls.myOtherControl.value;
    this.selectedList.forEach((value) => {
      this.idList.push(value.key);
    });
    this.service
      .payToAll(this.idList)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => {
        this.service._hotBalance.pipe(
          map((value1) =>
            value1.filter(
              (previousValue) => !this.idList.includes(previousValue.key)
            )
          ),
          map((val) =>
            this.reactiveService.getBalanceSubject('hotBalance').next(val)
          )
        );
      });
  }

  selectallusers() {
    this.users.selectAll();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
