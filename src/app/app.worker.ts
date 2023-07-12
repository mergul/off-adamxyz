// import { EventSourcePolyfill } from 'event-source-polyfill';
// import { BehaviorSubject } from 'rxjs';
// import { RecordSSE } from './core/record.sse';
// import { NewsPayload } from './core/news.model';
// const tagsBehaviorSubject = new BehaviorSubject<RecordSSE[]>([]);
// const newsBehaviorSubject = new BehaviorSubject<NewsPayload[]>([]);
// addEventListener('message', ({ data }) => {
//   let ev = JSON.parse(data[0]);
//   let evy = data[1];
//   Object.setPrototypeOf(ev, EventSourcePolyfill.prototype);
//   ev.addEventListener('top-tags', (event) => {
//     const topTags = JSON.parse(event.data);
//     tagsBehaviorSubject.next(topTags.list);
//   });
//   ev.addEventListener('top-news-' + evy, (event) => {
//     const topNews = JSON.parse(event.data);
//     newsBehaviorSubject.next(topNews.list);
//   });
//   postMessage(JSON.stringify(tagsBehaviorSubject.value));
// });
