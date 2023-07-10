import { Directive, EventEmitter, Output, NgZone } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  @Output() onScroll = new EventEmitter<number>();
  percentValue: number = 0;
  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  constructor(private zone: NgZone) {
    const elem = document.querySelector('.example-container') as HTMLElement;
    this.scrollObs(elem)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        //   const percent = Math.round((elem.scrollTop / (elem.scrollHeight - elem.clientHeight)) * 100);
        const percent = elem.scrollTop;
        if (this.percentValue !== percent) {
          this.percentValue = percent;
          this.onScroll.emit(percent);
          //   console.log('scrollTop --> '+elem.scrollTop+ ' scrollHeight --> '+elem.scrollHeight+ ' clientHeight --> '+elem.clientHeight);
        }
      });
  }

  scrollObs = (elem: HTMLElement) =>
    this.zone.runOutsideAngular(() =>
      fromEvent(elem, 'scroll', {
        passive: true,
      }).pipe(
        takeUntil(this.destroy$),
        throttleTime(100),
        distinctUntilChanged()
      )
    );

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
