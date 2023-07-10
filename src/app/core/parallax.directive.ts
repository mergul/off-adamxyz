// import {Directive, ElementRef, HostListener, Input, NgZone, Renderer2} from '@angular/core';
// import { fromEvent, Subject} from 'rxjs';
// import { distinctUntilChanged, takeUntil, throttleTime} from 'rxjs/operators';

// @Directive({selector: '[appParallax]'})
// export class ParallaxDirective {
//   destroy = new Subject();
//   destroy$ = this.destroy.asObservable();
//   private factor!: number;

//   constructor(private elementRef: ElementRef, private renderer: Renderer2, private zone: NgZone) {
//     const elem=document.querySelector('.example-container') as HTMLElement;
//     this.scrollObs(elem).pipe(takeUntil(this.destroy$)).subscribe(() => {
//       this.renderer.setProperty(this.elementRef.nativeElement, 'style',
//       `transform: translateY(${elem.scrollTop*this.factor/10}px)`);
//     });
//   }

//   scrollObs = (elem: HTMLElement) => this.zone.runOutsideAngular(() => fromEvent(elem, 'scroll', {
//     passive: true
//   }).pipe(takeUntil(this.destroy$), throttleTime(100), distinctUntilChanged()));

//   @Input('factor') set parallaxFactor(val) {
//     this.factor = val ? val : 1;
//   }
// }
