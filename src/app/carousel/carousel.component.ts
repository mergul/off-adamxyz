import {
  AnimationPlayer,
  AnimationBuilder,
  AnimationFactory,
  animate,
  style,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HammerGestureConfig } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Review } from '../core/news.model';
import { WindowRef } from '../core/window.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  public _mediaReviews!: Review[];
  private player!: AnimationPlayer;
  private playerS!: AnimationPlayer;
  itemWidth = 788;
  thumbWidth = 174;
  thumbHeight = 109;
  slideCount!: number;
  private currentSlide = 0;
  private sliderSlide = 0;
  @ViewChild('carousel', { read: ElementRef, static: false })
  public carousel;
  @ViewChild('slider', { read: ElementRef, static: false })
  public slider;
  height!: number;
  carouselWrapperStyle = {};
  wideStyle = {};
  sliderWrapperStyle = {};
  carouselWrapStyle = {};
  carouselPagerStyle = {};
  timing = '250ms ease-in';
  storagepath = 'https://storage.googleapis.com/sentral-news-media/';
  private _myMediaReviews!: Review[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private builder: AnimationBuilder,
    private winRef: WindowRef
  ) {
    if (data && data.mediaReviews) this._mediaReviews = data.mediaReviews;
  }

  ngOnInit(): void {
    if (!(this.data && this.data.mediaReviews)) {
      this._mediaReviews = this._myMediaReviews;
    }
    this.itemWidth = this.winRef.nativeWindow.innerWidth - 20;
    if (this.itemWidth < 1040) {
      this.thumbWidth = this.thumbWidth * (4 / 5) + 20;
      this.thumbHeight = this.thumbHeight * (4 / 5) + 30;
    } else {
      this.thumbWidth = this.thumbWidth + 20;
      this.thumbHeight = this.thumbHeight + 30;
    }
    if (this.itemWidth > 788) {
      this.itemWidth = 788;
    }
    this.height = 580 * (this.itemWidth / 788);
    const wid = this.winRef.nativeWindow.innerWidth;
    let modalWidth = wid >= 908 ? 808 : wid - (100 * wid) / 908;
    modalWidth -= 24;
    this.carouselWrapperStyle = {
      width: `${modalWidth}px`,
      height: `${500 * (this.itemWidth / 788)}px`,
    };
    this.wideStyle = {
      width: `${modalWidth}px`,
    };
    this.slideCount = Math.floor(modalWidth / this.thumbWidth);
    this.sliderWrapperStyle = {
      minHeight: `${this.height}px`,
    };
    this.carouselWrapStyle = {
      width: `${this.itemWidth * this._mediaReviews.length}px`,
    };
    this.carouselPagerStyle = {
      width: `${this.thumbWidth * this._mediaReviews.length}px`,
    };
  }
  @Input()
  get myMediaReviews(): Review[] {
    return this._myMediaReviews;
  }

  set myMediaReviews(value: Review[]) {
    this._myMediaReviews = value;
  }
  ngAfterViewInit() {
    const hammerConfig = new HammerGestureConfig();
    const hammer = hammerConfig.buildHammer(this.carousel.nativeElement);
    fromEvent(hammer, 'swipe')
      .pipe(takeWhile(() => true))
      .subscribe((res: any) => {
        res.deltaX > 0 ? this.prev() : this.next();
      });
    const mhammer = hammerConfig.buildHammer(this.slider.nativeElement);
    fromEvent(mhammer, 'swipe')
      .pipe(takeWhile(() => true))
      .subscribe((res: any) => {
        if (res.deltaX > 0) {
          this.sliderPrev();
        } else {
          this.sliderNext();
        }
      });
  }
  prev() {
    if (this.currentSlide === 0) {
      return;
    }

    this.currentSlide = this.currentSlide - 1;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.sliderSlide--;
    if ((this.currentSlide + 1) % this.slideCount === 0) {
      this.nextSlider(false);
    }
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.currentSlide + 1].classList.remove('active');
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.currentSlide].classList.add('active');
  }
  next() {
    if (this.currentSlide + 1 === this._mediaReviews.length) {
      return;
    }
    this.currentSlide = (this.currentSlide + 1) % this._mediaReviews.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.sliderSlide++;
    if (this.currentSlide % this.slideCount === 0) {
      this.nextSlider(true);
    }
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.currentSlide - 1].classList.remove('active');
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.currentSlide].classList.add('active');
  }
  sliderPrev() {
    if (this.sliderSlide === 0) {
      return;
    }
    this.sliderSlide--;
    if ((this.sliderSlide + 1) % this.slideCount === 0) this.nextSlider(false);
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide + 1].classList.remove('active');
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide].classList.add('active');
  }
  sliderNext() {
    if (this.sliderSlide + 1 === this._mediaReviews.length) {
      return;
    }
    this.sliderSlide++;
    if (this.sliderSlide % this.slideCount === 0) this.nextSlider(true);
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide - 1].classList.remove('active');
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide].classList.add('active');
  }
  nextSlider(isNext: boolean) {
    const mySoffset =
      (isNext ? this.sliderSlide : this.sliderSlide - 1) * this.thumbWidth;
    const mySAnimation: AnimationFactory = this.buildAnimation(mySoffset);
    this.playerS = mySAnimation.create(this.slider.nativeElement);
    this.playerS.onDone(() => {
      console.log(
        'player is done next animation --> ' + this.playerS.getPosition()
      );
    });
    this.playerS.play();
  }
  private buildAnimation(offset: number) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` })),
    ]);
  }
  currentDiv(n: number) {
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide].classList.remove('active');
    this.currentSlide = n;
    const offset = n * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.sliderSlide = n;
    this.slider.nativeElement
      .querySelectorAll('li')
      [this.sliderSlide].classList.add('active');
  }
  getReview(review: Review) {
    return new Review(
      this.storagepath + review.file_name,
      '',
      '',
      review.file_type
    );
  }
  getImgName(name) {
    return name.startsWith('bae') ? 'medium-' + name : name;
  }
  getThumb(name) {
    return name.startsWith('bae') ? 'thumb-kapak-' + name : name;
  }
}
