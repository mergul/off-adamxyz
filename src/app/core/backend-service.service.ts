import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News, NewsFeed, Offer, OfferFeed, OfferPayload } from './news.model';

@Injectable({
  providedIn: 'root',
})
export class BackendServiceService {
  completeOffer(newsId: string, offerId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      '/api/rest/news/completeOffer/' + newsId + '/' + offerId,
      {
        responseType: 'json',
      }
    );
  }
  closeOffer(offerId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      '/api/rest/news/closeOffer/' + offerId,
      {
        responseType: 'json',
      }
    );
  }
  getOffer(offerId: any) {
    return this.httpClient.get<Offer>('/api/rest/news/getOffer/' + offerId, {
      responseType: 'json',
    });
  }
  getOffers(list: string[]): Observable<Array<OfferPayload>> {
    return this.httpClient.get<Array<OfferPayload>>(
      '/api/rest/news/offerList/' + list,
      {
        responseType: 'json',
      }
    );
  }
  constructor(private httpClient: HttpClient) {}
  postImage(formData: FormData): Observable<News> {
    return this.httpClient.post<News>('/api/image/save', formData, {
      responseType: 'json',
      withCredentials: true,
      reportProgress: true,
    });
  }
  postNews(newsFeed: NewsFeed): Observable<boolean> {
    return this.httpClient.post<boolean>('/api/rest/news/save', newsFeed, {
      responseType: 'json',
    });
  }
  postOffer(offerFeed: OfferFeed): Observable<boolean> {
    return this.httpClient.post<boolean>('/api/rest/news/offers', offerFeed, {
      responseType: 'json',
    });
  }
  getSignedUrl(name: string): Observable<string> {
    return this.httpClient.get<string>('/api/rest/storage/' + name, {
      responseType: 'json',
    });
  }
}
