import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globals } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultiFilesService {
  private _url: BehaviorSubject<string[]> = new BehaviorSubject(['']);
  private _thumbs: Map<string, Blob> = new Map<string, Blob>();
  private _totalFiles: Array<File> = [];
  constructor(private http: HttpClient) {}
  get thumbs(): Map<string, Blob> {
    return this._thumbs;
  }
  set thumbs(value: Map<string, Blob>) {
    this._thumbs = value;
  }
  get totalFiles(): Array<File> {
    return this._totalFiles;
  }
  set totalFiles(value: Array<File>) {
    this._totalFiles = value;
  }
  getUrls(): Observable<Array<string>> {
    return this._url.asObservable();
  }
  setUrls(value: Array<string>) {
    this._url.next(value);
  }
  saveFiles(total_form) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });
    const options = {
      headers: httpHeaders,
    };
    return this.http.post(
      'http://' + globals.url + ':8090/api/image/save',
      total_form
    );
  }
  remove(index: number) {
    this.totalFiles.splice(index, 1);
    this.thumbs.delete(this.thumbs.keys()[index]);
    this._url.value.splice(index, 1);
  }
}
