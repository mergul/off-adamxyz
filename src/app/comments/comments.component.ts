import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { RecognitionResult, SpeechService } from '../core/speech-service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  private readonly destroy = new Subject<void>();
  private _url!: string;
  startButtonDisabled!: boolean;
  currentLanguage = 'tr';
  speechMessages!: Observable<RecognitionResult>;
  recognizing = false;
  localStream!: MediaStream;
  private constraints = {
    video: false,
    audio: true,
  };
  fillIt = '#c978dd';
  @ViewChild('startButton', { static: true })
  startButton!: ElementRef;
  @ViewChild('myInput', { static: true })
  textBox!: ElementRef;

  mitext = '';
  interimTranscript = '';
  news_comments: any;
  _newsId!: string;
  myGroup: FormGroup;
  _isDetail!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private speechService: SpeechService,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar
  ) {
    this.myGroup = this.formBuilder.group({
      news_comments: new FormControl(['']),
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  @Input()
  get isDetail(): boolean {
    return this._isDetail;
  }
  set isDetail(value: boolean) {
    this._isDetail = value;
  }
  @Input()
  get url(): string {
    return this._url;
  }
  set url(value: string) {
    this._url = value;
  }
  @Input()
  get newsId(): string {
    return this._newsId;
  }
  set newsId(value: string) {
    this._newsId = value;
    if (this.speechService.texts.has(this._newsId))
      this.speechMessages = of({
        transcript: this.speechService.texts.get(this._newsId),
      });
  }
  ngOnInit(): void {
    this.speechService.init();
    if (this.speechService._supportRecognition) {
      this.speechService.initializeSettings(this.currentLanguage);
    }
  }
  setBehavior = () => {
    this.speechService.navSpeech
      .pipe(takeUntil(this.destroy))
      .subscribe((boo) => {
        if (boo === this._newsId && this.speechService.texts.has(boo)) {
          const myB = this.speechService.texts.get(boo);
          if (myB) {
            this.speechMessages = of({ transcript: myB });
            this.mitext = myB;
          }
        }
      });
  };
  handleKey = (evt) => {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      this.handleSendButton(this.textBox.nativeElement.value);
    }
  };

  gotDevices(mediaDevices: MediaDeviceInfo[]) {
    return mediaDevices.filter((value) => value.kind === 'videoinput');
  }
  startCamera() {
    if (
      !this.startButton.nativeElement.children[0].classList.contains(
        'fill-outline'
      )
    ) {
      // console.log('starting observers :' + this.speechService.speechSubject.observers.length);
      if (
        this.speechService._supportRecognition &&
        this.speechService.speechSubject.observers.length === 0
      ) {
        this.speechMessages = this.speechService.getMessage().pipe(
          takeUntil(this.destroy),
          switchMap((text: RecognitionResult) => {
            if (text.transcript && text.info === 'final_transcript') {
              // console.log('final_transcript : -> ' + text?.transcript);
              this.handleSentence(text.transcript);
              text.transcript = this.mitext;
            } else if (text.transcript && text.info === 'print') {
              // console.log('print :' + text?.transcript);
              this.handleSendButton(text.transcript);
              text.transcript = this.mitext;
            } else if (text.transcript && text.info === 'interim_transcript') {
              // console.log('interim_transcript :' + text?.transcript);
              this.interimTranscript = text.transcript;
              text.transcript = this.mitext + this.interimTranscript;
            } else if (text.info === 'start') {
              this._snackBar.open(
                'Your Browser has support for Speech!',
                text?.transcript,
                {
                  duration: 3000,
                }
              );
              this.mitext = this.speechService.mitext
                ? this.speechService.mitext
                : this.mitext
                ? this.mitext
                : '';
              text.transcript = this.speechService.texts.get(this._newsId)
                ? this.speechService.texts.get(this._newsId)
                : '' + this.mitext;
              this.mitext = text?.transcript || '';
            } else {
              text.transcript = this.speechService.texts.get(this._newsId);
              console.log('last speech :' + !text.transcript);
              //  text.transcript?this.speechMessages=of({transcript: text.transcript}):console.log('empty speech!!!');
              if (text.transcript) this.mitext = text.transcript;
            }
            //  if(text.transcript) console.log('starting new :' + text?.transcript);
            return of(text);
          })
        );
      }
      if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        from(navigator.mediaDevices.enumerateDevices().then(this.gotDevices));
        navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(this.attachVideo.bind(this))
          .catch((error) => console.log('Error: ', error));
      } else {
        alert('Sorry, camera not available.');
      }
    } else {
      this.speechService.stop();
      this.renderer.removeClass(
        this.startButton.nativeElement.children[0],
        'fill-outline'
      );
      this.fillIt = '#c978dd';
      // console.log('stopped finalTranscript :' + this.mitext);
      // console.log('stopped interimTranscript :' + this.interimTranscript);
      // this.mitext+=' '+this.interimTranscript
      // this.handleSendButton(this.mitext);
      this.micStop();
    }
  }
  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechService.setLanguage(this.currentLanguage);
  }
  attachVideo(stream) {
    this.localStream = stream;
    if (this.speechService._supportRecognition) {
      if (this.recognizing) {
        this.speechService.stop();
        return;
      }
      this.speechService.startSpeech(stream.startTime);
      this.renderer.addClass(
        this.startButton.nativeElement.children[0],
        'fill-outline'
      );
      this.fillIt = 'red';
    }
  }
  handleSentence = (text) => {
    this.mitext += ' ' + text;
    this.speechService.mitext = this.mitext;
    this.interimTranscript = '';
  };
  public OnSubmit(val) {
    this.destroy.next();
    this.speechService.mitext = '';
    this.mitext = '';
    this.speechService.texts.delete(this._newsId);
    this.speechMessages = of({ transcript: this.mitext });
  }
  handleSendButton(text: string) {
    this.renderer.setAttribute(this.textBox.nativeElement, 'value', text);
    this.doPatch(text);
  }
  doPatch(term: string) {
    this.myGroup.controls.news_comments.patchValue(term);
    if (this.mitext.trim() !== '') {
      this.speechService.texts.set(this._newsId, this.mitext);
    }
  }
  micStop() {
    let tracks: any;
    if (this.localStream != null) {
      tracks = [...this.localStream.getTracks()];
    }
    if (tracks) {
      tracks.forEach(function (track) {
        track.stop();
      });
    }
    // console.log('stopping micStop :' +  this.mitext);
    // this.speechMessages=of({transcript: this.mitext});
    // if (this.mitext.trim()!=='') {
    //   this.speechService.texts.set(this._newsId, this.mitext);
    // }
  }
  setStage(newsId: string) {
    if (!this.speechService.navSpeech) {
      this.speechService.navSpeech = new BehaviorSubject<string>(newsId);
      this.setBehavior();
    }
  }
}
