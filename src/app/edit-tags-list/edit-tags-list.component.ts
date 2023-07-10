import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../core/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-tags-list',
  templateUrl: './edit-tags-list.component.html',
  styleUrls: ['./edit-tags-list.component.scss'],
})
export class EditTagsListComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private _isPub!: Observable<boolean>;
  _tags!: Observable<Array<string>>;
  private _booled!: boolean;
  @ViewChildren('followButtons') followButtons!: QueryList<ElementRef>;
  // @ViewChild('followButton', { static: false })
  // followButton!: ElementRef;
  pubs = false;

  constructor(private service: UserService, private renderer: Renderer2) {}

  @Input()
  get tags(): Observable<Array<string>> {
    return this._tags;
  }

  set tags(value: Observable<Array<string>>) {
    this._tags = value;
  }
  @Input()
  get booled(): boolean {
    return this._booled;
  }

  set booled(value: boolean) {
    this._booled = value;
  }
  @Input()
  get isPub(): Observable<boolean> {
    return this._isPub;
  }

  set isPub(value: Observable<boolean>) {
    this._isPub = value;
  }

  ngOnInit() {
    this.isPub.pipe(takeUntil(this.onDestroy)).subscribe((val) => {
      this.pubs = val;
    });
  }
  ngOnDestroy(): void {
    let tagz = this.service.newsCo
      .get(this.service.links[1])
      ?.filter((d) => d.startsWith('#'))
      .map((g) => g.substring(1));
    if (tagz && this.service.dbUser) this.service.dbUser.tags = tagz;
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  checkUser() {
    return !this.service.dbUser;
  }
  checkTag(tag: string) {
    let res = this.service.newsCo.get(this.service.links[1])?.includes(tag);
    console.log(
      'logsez= ',
      res,
      this.service.newsCo.get(this.service.links[1]),
      tag
    );
    return res;
  }
  removeTag(tag: string, i: number) {
    this.service
      .manageFollowingTag('#' + tag, false)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => {
        if (this.service.dbUser) {
          // this.service.dbUser.tags.splice(index, 1);
          this.service.newsCo.get(this.service.links[1])?.splice(i, 1);
          this.renderer.setProperty(
            this.followButtons.toArray()[i].nativeElement,
            'innerHTML',
            'Takip Et'
          );
        }
      });
  }
  addTag(tag: string, i: number) {
    this.service
      .manageFollowingTag('#' + tag, true)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => {
        // this.service.dbUser?.tags.push(tag);
        this.service.newsCo.get(this.service.links[1])?.push(tag);
        this.renderer.setProperty(
          this.followButtons.toArray()[i].nativeElement,
          'innerHTML',
          'Takibi Kes'
        );
      });
  }
}
