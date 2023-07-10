import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../core/user.model';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {

  _users!: Observable<Array<User>>;
  _booled!: boolean;

  constructor() { }

  @Input()
  get users(): Observable<Array<User>> {
    return this._users;
  }

  set users(value: Observable<Array<User>>) {
    this._users = value;
  }
  @Input()
  get booled(): boolean {
    return this._booled;
  }

  set booled(value: boolean) {
    this._booled = value;
  }

  ngOnInit() {
  }

}
