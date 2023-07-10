import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  Renderer2,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
import { NewsService } from '../core/news.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-req',
  templateUrl: './req.component.html',
  styleUrls: ['./req.component.scss'],
})
export class ReqComponent implements OnInit, AfterViewInit, OnDestroy {
  listenerFn!: () => void;
  color: string;
  wideStyle!: { width: string };
  constructor(
    private router: Router,
    private location: Location,
    private newsService: NewsService,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2
  ) {
    this.color = data.color;
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.onClose('');
  }
  ngOnInit() {
    const minu = this.data.header$ > 500 ? 250 : 0;
    const modalWidth = this.data.header$ - minu;
    this.wideStyle = {
      width: `${modalWidth}px`,
    };
    this.dialogRef.updateSize(`${this.data.header$ - minu + 24}px`, '200px');
  }
  ngAfterViewInit() {
    this.renderer.setStyle(
      this._document.querySelector('.mat-dialog-container'),
      'background-color',
      this.color
    );
  }

  onClose(redir) {
    if (redir === '') {
      this.newsService.activeLink = 'En Çok Okunanlar';
    }
    this.dialogRef.close(redir);
  }

  onDialogClick(event: UIEvent) {
    event.stopPropagation();
    event.cancelBubble = true;
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }
}
