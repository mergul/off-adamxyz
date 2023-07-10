import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BackendServiceService } from 'src/app/core/backend-service.service';
import { Observable, Subject } from 'rxjs';
import { OfferFeed } from 'src/app/core/news.model';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { MultiFilesService } from 'src/app/multi-files-upload/multi-files.service';
import { WindowRef } from 'src/app/core/window.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['../../multi-files-upload/multi-files-upload.component.css'],
})
export class OfferComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  private _url: Array<string> = [];
  private _purl: Array<string> = [];
  private thumburl: Array<string> = [];
  public thumbnails!: Observable<string[]>;
  listenerFn!: () => void;
  private signed: Map<string, string> = new Map<string, string>();
  public documentGrp: FormGroup;
  public offerFeed!: OfferFeed;
  languages: string[] = ['tr', 'en', 'es', 'de', 'fr'];
  currentLanguage = 'tr';
  targetLanguage = 'fr';
  foods!: Observable<MediaDeviceInfo[]>;
  startTopButtonDisabled!: boolean;
  startDescButtonDisabled!: boolean;
  whichButton!: boolean;
  recognizing = false;
  localStream!: MediaStream;
  private constraints = {
    video: false,
    audio: true,
  };
  miTopText = '';
  miDescText = '';
  miPriceText = '';

  isTopicActivated = false;
  isDescActivated = false;
  @ViewChild('startTopButton', { static: true }) startTopButton!: ElementRef;
  @ViewChild('startDescButton', { static: true }) startDescButton!: ElementRef;
  @ViewChild('topBox', { static: true }) topBox!: ElementRef;
  @ViewChild('textBox', { static: true }) textBox!: ElementRef;
  color!: string;
  wideStyle!: { width: string };
  loggedID!: string;
  isTopicValid = false;
  isDescValid = false;
  isPriceValid = false;
  interimTranscript = '';
  obs = new Map<number, any>();
  isSameObs!: boolean;
  newsId: string;
  newsOwnerId: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected multifilesService: MultiFilesService,
    private backendService: BackendServiceService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private winRef: WindowRef
  ) {
    this.documentGrp = this.formBuilder.group({
      offer_topic: new FormControl(['']),
      offer_description: new FormControl(['']),
      offer_price: new FormControl(['']),
      items: this.formBuilder.array([this.createUploadDocuments()]),
    });
    this.newsId = data.newsId;
    this.newsOwnerId = data.newsOwnerId;
  }

  ngOnInit() {
    const wid = this.winRef.nativeWindow.innerWidth;
    const modalWidth = wid >= 908 ? 808 : wid - (100 * wid) / 908;

    this.wideStyle = {
      width: `${modalWidth - 24}px`,
    };
    this.thumbnails = this.multifilesService.getUrls();

    this.loggedID = window.history.state.loggedID;
    this.documentGrp.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.isTopicValid =
          this.documentGrp.controls.offer_topic.value.toString().trim().length >
          3;
        this.isDescValid =
          this.documentGrp.controls.offer_description.value.toString().trim()
            .length > 3;
        this.isPriceValid =
          this.documentGrp.controls.offer_price.value.toString().trim().length >
          3;
      });
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.onClose();
  }

  handleSendButton = (text) => {
    if (this.whichButton) {
      this.renderer.setAttribute(this.topBox.nativeElement, 'value', text);
    } else {
      this.renderer.setAttribute(this.textBox.nativeElement, 'value', text);
    }
    this.doPatch(text);
  };

  handleKey = (evt) => {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      this.handleSendButton(this.textBox.nativeElement.value);
    }
  };

  doPatch(term: any): any {
    if (this.whichButton) {
      this.documentGrp.controls.news_topic.patchValue(term);
    } else {
      this.documentGrp.controls.news_description.patchValue(term);
    }
  }

  get totalFiles(): Array<File> {
    return this.multifilesService.totalFiles;
  }

  get thumbs(): Map<string, Blob> {
    return this.multifilesService.thumbs;
  }

  createUploadDocuments(): FormGroup {
    return this.formBuilder.group({
      documentFile: File,
    });
  }

  get items(): FormArray {
    return this.documentGrp.get('items') as FormArray;
  }
  removeAll() {
    this.totalFiles.splice(0, this.totalFiles.length);
    this.thumbs.clear();
    this._url.splice(0, this._url.length);
  }

  public generateThumbnail(videoFile: Blob, oldIndex: number): Promise<string> {
    const video: HTMLVideoElement = <HTMLVideoElement>(
      this.document.createElement('video')
    );
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      this.document.createElement('canvas')
    );
    const context = canvas.getContext('2d');
    const name = oldIndex === 0 ? 'thumb-kapak-' : 'thumb-';
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error', reject);
      video.addEventListener('error', reject);
      const event = () => {
        if (context) {
          let wi, he;
          const rati = 174 / 109;
          const ra = video.videoWidth / video.videoHeight;
          if (ra > rati) {
            wi = 174;
            he = (109 * rati) / ra;
          } else {
            he = 109;
            wi = (174 * ra) / rati;
          }
          video.currentTime = 90;
          canvas.width = 174;
          canvas.height = 109;
          context.drawImage(video, 0, 0, wi, he);
          this.thumburl[oldIndex] = canvas.toDataURL('image/jpeg', 0.5);
          this.multifilesService.setUrls(this.thumburl);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const df = this.totalFiles[oldIndex].name.lastIndexOf('.');
                const gd =
                  this.totalFiles[oldIndex].name.slice(0, df) + '.jpeg';
                this.thumbs.set(name + gd, blob);
                setTimeout(() => {
                  video.removeEventListener('canplay', event);
                }, 100);
                resolve(window.URL.createObjectURL(blob));
              }
            },
            'image/jpeg',
            0.5
          );
        }
      };
      video.addEventListener('canplay', event);
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }

  public fileSelectionEvents(fileInput: any, oldIndex: number) {
    const files = fileInput.target.files;
    const index = this.totalFiles.length + oldIndex;
    for (let i = 0; i < files.length; i++) {
      if (!this.checkIt(files[i])) {
        this.fileSelectionEvent(files[i], index + i);
      } else {
      }
    }
  }
  handleChunk = (chunk: Blob, name) => {
    if (chunk.size > 0) {
      this.backendService
        .getSignedUrl(name)
        .pipe()
        .subscribe((value) => {
          this.signed.set(name, value);
        });
    }
  };
  public async fileSelectionEvent(fileInput: any, oldIndex: number) {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      this.document.createElement('canvas')
    );
    const context = canvas.getContext('2d');
    const rat = 788 / 580;
    const rati = 174 / 109;
    this.totalFiles[oldIndex] = fileInput;
    if (this.totalFiles[oldIndex].type.includes('video')) {
      this.generateThumbnail(this.totalFiles[oldIndex], oldIndex).then(
        (data) => {
          this._url[oldIndex] = data;
        }
      );
    } else if (context && this.totalFiles[oldIndex].type.includes('image')) {
      const reader = new FileReader();
      const image = new Image();
      const name = oldIndex === 0 ? 'thumb-kapak-' : 'thumb-';
      reader.onload = (event: any) => {
        image.setAttribute('src', event.target.result);
        image.onload = () => {
          let wi, he;
          const ra = image.naturalWidth / image.naturalHeight;
          if (ra > rati) {
            wi = 174;
            he = (109 * rati) / ra;
          } else {
            he = 109;
            wi = (174 * ra) / rati;
          }
          canvas.width = 174;
          canvas.height = 109;
          context.drawImage(
            image,
            canvas.width / 2 - wi / 2,
            canvas.height / 2 - he / 2,
            wi,
            he
          );
          this.thumburl[oldIndex] = canvas.toDataURL('image/jpeg', 0.5);
          this.multifilesService.setUrls(this.thumburl);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const df = this.totalFiles[oldIndex].name.lastIndexOf('.');
                const gd =
                  this.totalFiles[oldIndex].name.slice(0, df) + '.jpeg';
                this.thumbs.set(name + gd, blob);
                this._url[oldIndex] = window.URL.createObjectURL(blob);
              }
            },
            'image/jpeg',
            0.5
          );

          if (ra > rat) {
            wi = 788;
            he = (580 * rat) / ra;
          } else {
            he = 580;
            wi = (788 * ra) / rat;
          }
          canvas.width = 788;
          canvas.height = 580;
          context.drawImage(
            image,
            canvas.width / 2 - wi / 2,
            canvas.height / 2 - he / 2,
            wi,
            he
          );
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const df = this.totalFiles[oldIndex].name.lastIndexOf('.');
                const gd =
                  this.totalFiles[oldIndex].name.slice(0, df) + '.jpeg';
                this.thumbs.set('medium-' + gd, blob);
              }
            },
            'image/jpeg',
            0.5
          );
        };
      };
      reader.onloadend = (event: any) => {};
      reader.readAsDataURL(fileInput);
    }
  }

  uploadToSignStorage() {
    this.signed.forEach((value, key) => {
      const badf = this.totalFiles.find((value1) => key === value1.name);
      const ffg = this.thumbs.get(key);
      const fes = badf ? badf : ffg ? ffg : new Blob();
      fetch(value, {
        method: 'PUT',
        headers: {
          'Content-Type': fes.type, // 'application/octet-stream'
        },
        body: fes,
      }).then((valuem) => {
        if (valuem.ok) {
        }
      });
    });
  }

  public OnSubmit(formValue: any) {
    if (
      !formValue.offer_description[0] &&
      !formValue.offer_topic[0] &&
      !formValue.offer_price[0]
    ) {
      return;
    }
    const AllFilesObj: any[] = [];
    let MediaPartObj: any[] = [];
    if (this.signed.size > 1) {
      this.totalFiles.forEach((element) => {
        const eachObj = {
          file_name: element.name,
          file_type: element.type,
          has_medium: this.thumbs.has(
            'medium-' +
              element.name.slice(0, element.name.lastIndexOf('.')) +
              '.jpeg'
          ),
        };
        AllFilesObj.push(eachObj);
      });
      MediaPartObj = Array.from(this.signed.keys());
    } else {
      // if (this.totalFiles.length === 0) {
      AllFilesObj.push(
        {
          file_name: 'bae.jpeg',
          file_type: 'image/jpeg',
          has_medium: true,
        },
        {
          file_name: 'bae.jpeg',
          file_type: 'image/jpeg',
          has_medium: true,
        },
        {
          file_name: 'bae.jpeg',
          file_type: 'image/jpeg',
          has_medium: true,
        }
      );
      MediaPartObj.push(
        'bae.jpeg',
        'thumb-kapak-bae.jpeg',
        'medium-bae.jpeg',
        'bae.jpeg',
        'thumb-kapak-bae.jpeg',
        'medium-bae.jpeg',
        'bae.jpeg',
        'thumb-kapak-bae.jpeg',
        'medium-bae.jpeg'
      );
    }
    if (formValue.offer_topic)
      this._purl = formValue.offer_topic.match(/#[a-zığüşöçĞÜŞÖÇİ0-9_.]+/gi);
    this.offerFeed = new OfferFeed(
      this.newsOwnerId,
      this.newsId,
      formValue.offer_topic,
      this.text2HTML(formValue.offer_description),
      formValue.offer_price,
      this._purl != null ? this._purl : [],
      AllFilesObj,
      MediaPartObj,
      Date.now()
    );

    this.backendService
      .postOffer(this.offerFeed)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((val) => {
        console.log('Multi success --> ', val);
        //  this.userService.increaseCount().pipe(takeUntil(this.onDestroy)).subscribe(value1 => {
        this.removeAll();
        this.dialogRef.close();

        // });
      });
  }

  text2HTML(text: string) {
    const hhhg = this.document
      .getElementById('offer_description')
      ?.getAttribute('value');
    if (hhhg && text !== hhhg) {
      return hhhg;
    } else {
      // 1: Plain Text Search
      let text1 = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // 2: Line Breaks
      text1 = text1.replace(/\r\n?|\n/g, '<br>');

      // 3: Paragraphs
      text1 = text1.replace(/<br>\s*<br>/g, '</p><p>');

      // 4: Wrap in Paragraph Tags
      text1 = '<p>' + text1 + '</p>';

      return text1;
    }
  }

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.document.querySelector('.mat-dialog-container'),
      'background',
      this.color
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onDialogClick(event: UIEvent) {
    event.stopPropagation();
    event.cancelBubble = true;
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private checkIt(file: File): boolean {
    return this.totalFiles.some(
      (value) => value.name === file.name && value.size === file.size
    );
  }
  async readAllChunks(readableStream): Promise<Blob[]> {
    const reader = readableStream.getReader();
    const chunks: Blob[] = [];

    return pump();

    function pump(): Promise<Blob[]> {
      return reader.read().then(({ value, done }) => {
        if (done) {
          return chunks;
        }

        chunks.push(value);
        return pump();
      });
    }
  }
  closeOffer() {
    this.dialogRef.close();
  }
}
