import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from './user.model';
import {News} from './news.model';

@Injectable( { providedIn: 'root' })
export class SearchService {
    newsApiRoot = '/api/rest/news/search/';
    usersApiRoot = '/api/rest/users/search/';
    newsList: any;
    activeLink: any;
    orderBy: any;
    constructor(protected http: HttpClient) { }
    searchNews(term: string): Observable<Array<News>> {
        if (term === '' || term.trim() === '') { return of([]); }
        return this.http.get<Array<News>>(this.newsApiRoot + term, {
            responseType: 'json', withCredentials: true
        });
    }
    searchPeople(term: string): Observable<Array<User>> {
        if (term === '' || term.trim() === '') { return of([]); }
        return this.http.get<Array<User>>(this.usersApiRoot + term, {
            responseType: 'json', withCredentials: true
        });
    }
}
