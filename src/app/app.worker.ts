// import { EventSourcePolyfill } from 'event-source-polyfill';
// import { BehaviorSubject } from 'rxjs';
// import { NewsPayload, OfferPayload } from './core/news.model';
// const offersBehaviorSubject = new BehaviorSubject<OfferPayload[]>([]);
// const newsBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);
// addEventListener('message', ({ data }) => {
//   let ev = JSON.parse(data[0]);
//   let evy = data[1];
//   Object.setPrototypeOf(ev, EventSourcePolyfill.prototype);
//   console.log('webworker: ', ev._listeners, ' number: ', evy);
//   ev.addEventListener('top-offers', (event) => {
//     const topOffers = JSON.parse(event.data);
//     offersBehaviorSubject.next(topOffers.list);
//   });
//   ev.addEventListener('top-news', (event) => {
//     const topNews = JSON.parse(event.data);
//     newsBehaviorSubject.next(topNews.list);
//   });
//   postMessage(JSON.stringify(offersBehaviorSubject.value));
// });
