import { Injectable, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable, BehaviorSubject } from 'rxjs';
import { NewsPayload, OfferPayload } from './news.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RecordSSE } from './record.sse';
import { BalanceRecord } from './user.model';

@Injectable({ providedIn: 'root' })
export class ReactiveStreamsService {
  private newsEventSource: EventSourcePolyfill;
  private newsBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);
  private tagsBehaviorSubject = new BehaviorSubject<RecordSSE[]>([]);
  private countsBehaviorSubject = new BehaviorSubject<RecordSSE[]>([]);
  private publicBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);
  private followedTagsSubject = new BehaviorSubject<NewsPayload[]>([]);
  private followedPeopleSubject = new BehaviorSubject<NewsPayload[]>([]);
  private meBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);

  private offersSubject = new BehaviorSubject<OfferPayload[]>([]);
  private meOfferSubject = new BehaviorSubject<OfferPayload[]>([]);
  private myOfferSubject = new BehaviorSubject<OfferPayload[]>([]);
  private followedTagOffers = new BehaviorSubject<OfferPayload[]>([]);
  private followedPeopleOffers = new BehaviorSubject<OfferPayload[]>([]);
  private publicOffersSubject = new BehaviorSubject<OfferPayload[]>([]);
  private balanceBehaviorSubject = new BehaviorSubject<BalanceRecord[]>([]);
  private renderer!: Renderer2;

  publicStreamList$: Map<string, NewsPayload[]> = new Map<
    string,
    NewsPayload[]
  >();
  publicOfferList$: Map<string, OfferPayload[]> = new Map<
    string,
    OfferPayload[]
  >();

  nlinks = [
    'En Çok Okunanlar',
    'Takip Edilen Etiketler',
    'Takip Edilen Kişiler',
  ];
  private hotUsersBehaviorSubject = new BehaviorSubject<BalanceRecord[]>([]);
  processName!: number;
  random: number = 0;
  isSubscribed = true;
  index: number = 0;
  mainlistenerFn = () => {};
  mainlistenerStartFn = () => {};
  mainTaglistenerFn = () => {};
  mainCountlistenerFn = () => {};
  meLıstenerStartFn = () => {};
  myPeoplelistenerFn = () => {};
  myTagslistenerFn = () => {};
  offerslistenerFn = () => {};
  offersStartlistenerFn = () => {};

  topNewsList: Map<string, Array<string>> = new Map<string, Array<string>>();
  mainxListener!: (ev: any, ism: any, iso: any) => void;
  mainTagxListener!: (ev: any, ism: any, iso: any) => void;
  mainCouxListener!: (ev: any, ism: any, iso: any) => void;

  mexListener!: (ev: any, ism: any, iso: any, ist: any, isp: any) => void;
  otherxListener!: (ev: any, ism: any, iso: any, ist: any, isp: any) => void;
  myTagxListener!: (ev: any, ism: any, iso: any, ist: any, isp: any) => void;
  myPeoplexListener!: (ev: any, ism: any, iso: any, ist: any, isp: any) => void;
  minexListener!: (ev: any, ism: any, iso: any, ist: any, isp: any) => void;

  meOfferListener!: (ev: any, ism: any, iso: any) => void;
  myOfferListener!: (ev: any, ism: any, iso: any) => void;
  thyOfferListener!: (ev: any, ism: any, iso: any) => void;

  mainListener: any;
  mainTagListener: any;
  mainCouListener: any;
  meListener: any;
  mineListener: any;
  othersListener: any;
  myTagsListener: any;
  myPeopleListener: any;

  meOffListener: any;
  myOffListener: any;
  thyOffListener: any;

  constructor(
    private zone: NgZone,
    protected http: HttpClient,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }
  getNewsStream(processName: number, url: string) {
    this.processName = processName;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers
      .append('accept', 'text/event-stream')
      .append('X-Custom-Header', 'last-event-id');

    this.newsEventSource = new EventSourcePolyfill(url, {
      headers: headers,
      withCredentials: true,
      heartbeatTimeout: 120000,
    });

    this.mainxListener = (ev, ism, iso) => this.listenMain(ev, ism, iso);
    this.mainListener = this.mainxListener.bind(this, true, false);
    this.mainTagxListener = (ev, ism, iso) => this.listenMain(ev, ism, iso);
    this.mainTagListener = this.mainTagxListener.bind(this, false, true);
    this.mainCouxListener = (ev, ism, iso) => this.listenMain(ev, ism, iso);
    this.mainCouListener = this.mainCouxListener.bind(this, false, false);

    this.mexListener = (ev, ism, iso, ist, isp) =>
      this.listenIt(ev, ism, iso, ist, isp);
    this.meListener = this.mexListener.bind(this, true, false, false, false);
    this.otherxListener = (ev, ism, iso, ist, isp) =>
      this.listenIt(ev, ism, iso, ist, isp);
    this.othersListener = this.otherxListener.bind(
      this,
      false,
      true,
      false,
      false
    );
    this.myPeoplexListener = (ev, ism, iso, ist, isp) =>
      this.listenIt(ev, ism, iso, ist, isp);
    this.myPeopleListener = this.myPeoplexListener.bind(
      this,
      false,
      false,
      false,
      true
    );
    this.myTagxListener = (ev, ism, iso, ist, isp) =>
      this.listenIt(ev, ism, iso, ist, isp);
    this.myTagsListener = this.myTagxListener.bind(
      this,
      false,
      false,
      true,
      false
    );
    this.minexListener = (ev, ism, iso, ist, isp) =>
      this.listenIt(ev, ism, iso, ist, isp);
    this.mineListener = this.minexListener.bind(
      this,
      false,
      false,
      false,
      false
    );

    this.meOfferListener = (ev, ism, iso) => this.listenOffer(ev, ism, iso);
    this.meOffListener = this.meOfferListener.bind(this, true, false);
    this.myOfferListener = (ev, ism, iso) => this.listenOffer(ev, ism, iso);
    this.myOffListener = this.myOfferListener.bind(this, false, true);
    this.thyOfferListener = (ev, ism, iso) => this.listenOffer(ev, ism, iso);
    this.thyOffListener = this.thyOfferListener.bind(this, false, false);

    this.mainlistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-news',
      this.mainListener
    );
    this.offerslistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-offers',
      (event) => {
        const topOffers = JSON.parse(event.data);
        const list = this.offersSubject.getValue();
        this.zone.run(() => {
          this.offersSubject.next([...list, ...topOffers.list]);
        });
      }
    );
    this.mainlistenerStartFn = this.renderer.listen(
      this.newsEventSource,
      'top-news-' + processName,
      this.mainListener
    );
    this.mainTaglistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-tags',
      this.mainTagListener
    );
    this.mainCountlistenerFn = this.renderer.listen(
      this.newsEventSource,
      'user-counts',
      this.mainCouListener
    );
    this.offersStartlistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-offers-' + processName,
      (event) => {
        const topOffers = JSON.parse(event.data);
        const list = this.offersSubject.getValue();
        this.zone.run(() => {
          if (!this.isSubscribed) {
            list.splice(this.index, topOffers.list.length, ...topOffers.list);
            this.offersSubject.next([...list]);
            this.index += topOffers.list.length;
          } else {
            this.offersSubject.next([...list, ...topOffers.list]);
          }
        });
      }
    );

    this.newsEventSource.addEventListener('close', (event) => {
      this.closeSources();
    });
    this.newsEventSource.onerror = (err) =>
      this.zone.run(() => {
        if (this.newsEventSource.readyState === 0) {
          this.isSubscribed = false;
          this.index = 0;
          this.unsubscribeResource();
        } else {
          this.newsBehaviorSubject.error(
            'EventSource error:::' + err.statusText
          );
          this.tagsBehaviorSubject.error(
            'EventSource error:::' + err.statusText
          );
          this.countsBehaviorSubject.error(
            'EventSource error:::' + err.statusText
          );
        }
      });

    // const worker = new Worker(new URL('../app.worker', import.meta.url));
    // worker.onmessage = ({ data }) => {
    //   console.log(`page got message: ${data}`);
    // };
    // worker.postMessage([JSON.stringify(this.newsEventSource), processName]);
  }
  listenMain(isMe: any, isOther: any, event: any): void {
    if (isMe) {
      const topNews = JSON.parse(event.data);
      const list = this.newsBehaviorSubject.getValue();
      this.zone.run(() => {
        if (!this.isSubscribed) {
          list.splice(this.index, topNews.list.length, ...topNews.list);
          this.newsBehaviorSubject.next([...list]);
          this.index += topNews.list.length;
        } else {
          this.newsBehaviorSubject.next([...list, ...topNews.list]);
        }
      });
    } else if (isOther) {
      const topTags = JSON.parse(event.data);
      this.zone.run(() => this.tagsBehaviorSubject.next(topTags.list));
    } else {
      const userCounts = JSON.parse(event.data);
      this.zone.run(() => this.countsBehaviorSubject.next(userCounts));
    }
  }
  resetMainListeners() {
    this.mainlistenerStartFn();
    this.mainlistenerFn();
    this.mainTaglistenerFn();
    this.mainCountlistenerFn();
    this.offersStartlistenerFn();
    this.offerslistenerFn();
    // this.newsEventSource.removeEventListener(
    //   'top-news-' + this.processName,
    //   this.mainListener,
    //   true
    // );
    // this.newsEventSource.removeEventListener(
    //   'top-news',
    //   this.mainListener,
    //   true
    // );
    // this.newsEventSource.removeEventListener(
    //   'top-tags',
    //   this.mainTagListener,
    //   true
    // );
    // this.newsEventSource.removeEventListener(
    //   'user-counts',
    //   this.mainCouListener,
    //   true
    // );
  }
  listenOffer(isMe: any, isOther: any, event: any): void {
    if (isMe) {
      this.addOfferSubject(this.getOffersSubject('me'), event);
    } else if (isOther) {
      this.addOfferSubject(this.getOffersSubject('my'), event);
    } else if (event.lastEventId === 'people' || event.lastEventId === 'tags') {
      this.addToSubjectOffer(this.getOffersSubject(event.lastEventId), event);
    } else if (event.lastEventId === 'my') {
      this.addOfferSubject(this.getOffersSubject('other'), event);
    }
  }
  addToSubjectOffer = (subj: BehaviorSubject<OfferPayload[]>, event: any) => {
    const topOffers = JSON.parse(event.data);
    const list = subj.getValue();
    this.zone.run(() => subj.next([...list, ...topOffers.list]));
  };
  addOfferSubject = (subj: BehaviorSubject<OfferPayload[]>, event: any) => {
    const topOffers = JSON.parse(event.data);
    this.zone.run(() => {
      const array2: string[] = [];
      const array3: OfferPayload[] = [];
      subj.getValue().map((xx) => {
        array2.push(xx.id);
        topOffers.list.forEach((payload: OfferPayload) => {
          if (payload.id === xx.id) {
            array3.push(xx);
          }
        });
      });
      topOffers.list.forEach((df: OfferPayload) => {
        if (!array2.includes(df.id)) {
          array3.push(df);
        }
      });
      subj.next(array3);
      if (event.lastEventId === 'my') {
        this.publicOfferList$.set(
          event.type.split('-')[2].substring(2),
          topOffers.list
        );
      }
    });
  };

  getNewsSubject(id: string): BehaviorSubject<NewsPayload[]> {
    switch (id) {
      case 'main':
        return this.newsBehaviorSubject;
      case 'tags':
        return this.followedTagsSubject;
      case 'people':
        return this.followedPeopleSubject;
      case 'me':
        return this.meBehaviorSubject;
      case 'other':
        return this.publicBehaviorSubject;
      default:
        return this.newsBehaviorSubject;
    }
  }
  getOffersSubject(id: string): BehaviorSubject<OfferPayload[]> {
    switch (id) {
      case 'main':
        return this.offersSubject;
      case 'tags':
        return this.followedTagOffers;
      case 'people':
        return this.followedPeopleOffers;
      case 'me':
        return this.meOfferSubject;
      case 'my':
        return this.myOfferSubject;
      case 'other':
        return this.publicOffersSubject;
      default:
        return this.offersSubject;
    }
  }
  getBalanceSubject(id: string) {
    switch (id) {
      case 'hotRecords':
        return this.hotUsersBehaviorSubject;
      case 'user-history':
        return this.balanceBehaviorSubject;
      default:
        return this.hotUsersBehaviorSubject;
    }
  }
  getMessage(sub): Observable<any> {
    switch (sub) {
      case this.nlinks[0]:
        return this.newsBehaviorSubject.asObservable();
      case 'top-tags':
        return this.tagsBehaviorSubject.asObservable();
      case 'user-counts':
        return this.countsBehaviorSubject.asObservable();
      case 'other-person':
        return this.publicBehaviorSubject.asObservable();
      case this.nlinks[1]:
        return this.followedTagsSubject.asObservable();
      case this.nlinks[2]:
        return this.followedPeopleSubject.asObservable();
      case 'me':
        return this.meBehaviorSubject.asObservable();
      case 'user-history':
        return this.balanceBehaviorSubject.asObservable();
      case 'hotRecords':
        return this.hotUsersBehaviorSubject.asObservable();
      default:
        return this.newsBehaviorSubject.asObservable();
    }
  }
  setListeners(id: string) {
    this.setFirstListeners(id);
    this.newsEventSource.addEventListener(
      'top-news-' + id,
      this.meListener,
      true
    );
    this.newsEventSource.addEventListener(
      'top-offers-' + id,
      this.meOffListener,
      true
    );
    this.newsEventSource.addEventListener(
      'top-offers-' + '@' + id,
      this.myOffListener,
      true
    );
    this.newsEventSource.addEventListener('user-counts-' + id, (event) => {
      const userCounts = JSON.parse(event.data);
      this.zone.run(() => this.countsBehaviorSubject.next(userCounts));
    });
  }
  setFirstListeners(id: string) {
    const myB = this.topNewsList.get('top-news-' + id);
    if (myB) {
      if (myB.includes('other')) {
        this.resetOtherListListeners(id);
        this.topNewsList.set(
          'top-news-' + id,
          myB.filter((fer) => fer !== 'other')
        );
      } else if (myB.includes('follow')) {
        this.resetUserListListeners(id);
        this.topNewsList.set(
          'top-news-' + id,
          myB.filter((fer) => fer !== 'follow')
        );
      }
    }
    this.topNewsList.set('top-news-' + id, ['me']);
    this.meLıstenerStartFn = this.renderer.listen(
      this.newsEventSource,
      'top-news-' + id + '-' + this.random,
      this.meListener
    );
    this.newsEventSource.addEventListener(
      'top-offers-' + id + '-' + this.random,
      this.meOffListener,
      true
    );
    this.newsEventSource.addEventListener(
      'top-offers-' + '@' + id + '-' + this.random,
      this.myOffListener,
      true
    );
    this.myPeoplelistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-news-people-' + id + '-' + this.random,
      this.myPeopleListener
    );
    this.newsEventSource.addEventListener(
      'top-offers-people-' + id + '-' + this.random,
      this.thyOffListener,
      true
    );
    this.myTagslistenerFn = this.renderer.listen(
      this.newsEventSource,
      'top-news-tags-' + id + '-' + this.random,
      this.myTagsListener
    );
    this.newsEventSource.addEventListener(
      'top-offers-tags-' + id + '-' + this.random,
      this.thyOffListener,
      true
    );
  }
  addToSubjectSingle = (subj: BehaviorSubject<NewsPayload[]>, event: any) => {
    const topNews = JSON.parse(event.data);
    const list = subj.getValue();
    this.zone.run(() => subj.next([...list, ...topNews.list]));
  };
  listenIt = (isMe, isOther, isTags, isPeople, event: any) => {
    if (isMe) {
      this.addToSubjectSingle(this.getNewsSubject('me'), event);
      this.meLıstenerStartFn();
    } else if (isOther) {
      this.addToSubject(this.getNewsSubject('other'), event);
      this.publicStreamList$.set(
        event.type.split('-')[2].substring(1),
        this.publicBehaviorSubject.getValue()
      );
    } else if (isPeople) {
      this.addToSubject(this.getNewsSubject('people'), event);
      this.myPeoplelistenerFn();
    } else if (isTags) {
      this.addToSubject(this.getNewsSubject('tags'), event);
      this.myTagslistenerFn();
    } else if (event.lastEventId === 'person' || event.lastEventId === 'tag') {
      this.addToSubject(this.getNewsSubject('other'), event);
      this.publicStreamList$.set(
        event.type.split('-')[2].substring(1),
        this.publicBehaviorSubject.getValue()
      );
      event.lastEventId === 'person'
        ? this.addToSubjectSingle(this.followedPeopleSubject, event)
        : this.addToSubjectSingle(this.followedTagsSubject, event);
    }
  };
  addToSubject = (subj: BehaviorSubject<NewsPayload[]>, event: any) => {
    const topNews = JSON.parse(event.data);
    this.zone.run(() => {
      const array2: string[] = [];
      const array3: NewsPayload[] = [];
      subj.getValue().map((xx) => {
        array2.push(xx.newsId);
        topNews.list.forEach((payload: NewsPayload) => {
          if (payload.newsId === xx.newsId) {
            array3.push(xx);
          }
        });
      });
      topNews.list.forEach((df: NewsPayload) => {
        if (!array2.includes(df.newsId)) {
          array3.push(df);
        }
      });
      subj.next(array3);
      if (event.lastEventId === 'me') {
        this.publicStreamList$.set(
          event.type.split('-')[2].substring(1),
          topNews.list
        );
      }
    });
  };
  resetUserListListeners(id: string, isMe = false) {
    this.newsEventSource.removeEventListener(
      'top-news-' + id,
      this.mineListener,
      true
    );
    this.newsEventSource.removeEventListener(
      'top-news-' + id + '-' + this.random,
      this.mineListener,
      true
    );
    if (id.charAt(0) === '@') {
      const pj = this.followedPeopleSubject
        .getValue()
        .filter((nh) => nh.newsOwnerId !== id.substring(1));
      this.followedPeopleSubject.next(pj);
      const myB = this.topNewsList.get('top-news-' + id);
      if (isMe) {
        this.meBehaviorSubject.next([]);
        if (myB)
          this.topNewsList.set(
            'top-news-' + id,
            myB.filter((fer) => fer !== 'me')
          );
      }
      if (myB)
        this.topNewsList.set(
          'top-news-' + id,
          myB.filter((fer) => fer !== 'follow')
        );
    } else {
      const tj = this.followedTagsSubject
        .getValue()
        .filter((nh) => !nh.tags.includes(id));
      this.followedTagsSubject.next(tj);
    }
  }
  setUserListListeners(id: string) {
    const myB = this.topNewsList.get('top-news-' + id);
    if (myB) myB.push('follow');
    else this.topNewsList.set('top-news-' + id, ['follow']);
    this.newsEventSource.addEventListener(
      'top-news-' + id + '-' + this.random,
      this.mineListener,
      true
    );
    this.newsEventSource.addEventListener(
      'top-news-' + id,
      this.mineListener,
      true
    );
  }
  resetOtherListListeners(id: string, isMe = false) {
    this.newsEventSource.removeEventListener(
      'top-news-' + id,
      this.othersListener,
      true
    );
    this.newsEventSource.removeEventListener(
      'top-news-' + id + '-' + this.random,
      this.othersListener,
      true
    );
    const myB = this.topNewsList.get('top-news-' + id);
    if (isMe) {
      this.newsEventSource.removeEventListener(
        'top-news-' + id,
        this.meListener,
        true
      );
      // this.newsEventSource.removeEventListener(
      //   'top-news-' + id + '-' + this.random,
      //   this.meListener,
      //   true
      // );
      this.meBehaviorSubject.next([]);
      if (myB)
        this.topNewsList.set(
          'top-news-' + id,
          myB.filter((fer) => fer !== 'me')
        );
    } else {
      this.publicBehaviorSubject.next([]);
      if (myB)
        this.topNewsList.set(
          'top-news-' + id,
          myB.filter((fer) => fer !== 'other')
        );
    }
  }
  resetNavListListeners(id: string) {
    this.resetOtherListListeners(id, true);
    this.newsEventSource.removeEventListener(
      'top-news-tags-' + id + '-' + this.random,
      this.myTagsListener,
      true
    );
    this.newsEventSource.removeEventListener(
      'top-news-people-' + id + '-' + this.random,
      this.myPeopleListener,
      true
    );
    this.followedPeopleSubject.next([]);
    this.followedTagsSubject.next([]);
    this.unsubscribeResource();
  }
  setOtherListener(id: string) {
    console.log('setOtherListener id: ', id);
    if (!this.topNewsList.has('top-news-' + id)) {
      this.topNewsList.set('top-news-' + id, ['other']);
      this.newsEventSource.addEventListener(
        'top-news-' + id + '-' + this.random,
        this.othersListener,
        true
      );
      this.newsEventSource.addEventListener(
        'top-news-' + id,
        this.othersListener,
        true
      );
      this.newsEventSource.addEventListener('user-counts-' + id, (event) => {
        const userCounts = JSON.parse(event.data);
        this.zone.run(() => this.countsBehaviorSubject.next(userCounts));
      });
    } else if (this.publicStreamList$.has(id.substring(1))) {
      const myB = this.publicStreamList$.get(id.substring(1));
      if (myB) this.publicBehaviorSubject.next(myB);
      const myO = this.publicOfferList$.get(id.substring(1));
      if (myO) this.publicOffersSubject.next(myO);
    } else {
      this.publicBehaviorSubject.next(
        this.followedPeopleSubject
          .getValue()
          .filter((val) => val.newsOwnerId === id.substring(1))
      );
    }
    this.newsEventSource.addEventListener(
      'top-offers-' + '@' + id + '-' + this.random,
      this.thyOffListener,
      true
    );
    // const sal = this.followedPeopleOffers
    //   .getValue()
    //   .filter((val) => val.ownerId === id.substring(1));
    // if (sal.length > 0) this.publicOffersSubject.next(sal);
  }
  statusOfNewsSource = () => {
    return this.newsEventSource;
  };
  closeSources() {
    this.unsubscribeResource();
    this.newsEventSource.close();
  }
  unsubscribeResource() {
    console.log('unsubscribeResource --> ' + this.random);
    this.resetMainListeners();
    fetch('/sse/unsubscribe', {
      keepalive: true,
      method: 'PATCH',
      body: 'TopNews' + this.random,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
