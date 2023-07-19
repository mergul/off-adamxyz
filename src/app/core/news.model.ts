import { Identifier } from '../core/Identifier.model';
export class NewsPayload {
  private _newsId: string;
  private _newsOwner: string;
  private _tags: string[];
  private _topics: string[];
  private _clean: boolean;
  private _newsOwnerId: string;
  private _ownerUrl: string;
  private _topic: string;
  private _thumb: string;
  private _date: number;
  private _count: number;
  private _offers: string[];
  constructor(
    newsId: string,
    newsOwner: string,
    tags: string[],
    topics: string[],
    clean: boolean,
    newsOwnerId: string,
    ownerUrl: string,
    topic: string,
    thumb: string,
    count: number,
    date: number,
    offers: string[] = ['']
  ) {
    this._newsId = newsId;
    this._newsOwner = newsOwner;
    this._tags = tags;
    this._topics = topics;
    this._clean = clean;
    this._date = date;
    this._newsOwnerId = newsOwnerId;
    this._ownerUrl = ownerUrl;
    this._thumb = thumb;
    this._topic = topic;
    this._count = count;
    this._offers = offers;
  }
  get newsId(): string {
    return this._newsId;
  }

  set newsId(value: string) {
    this._newsId = value;
  }
  get count(): number {
    return this._count;
  }
  get topics(): string[] {
    return this._topics;
  }

  set topics(value: string[]) {
    this._topics = value;
  }

  get newsOwner(): string {
    return this._newsOwner;
  }

  set newsOwner(value: string) {
    this._newsOwner = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }
  get clean(): boolean {
    return this._clean;
  }

  set clean(value: boolean) {
    this._clean = value;
  }
  get newsOwnerId(): string {
    return this._newsOwnerId;
  }
  get ownerUrl(): string {
    return this._ownerUrl;
  }
  get topic(): string {
    return this._topic;
  }

  get thumb(): string {
    return this._thumb;
  }

  get date(): number {
    return this._date;
  }
  get offers(): string[] {
    return this._offers;
  }
  set offers(value: string[]) {
    this._offers = value;
  }
}
export interface IdWrapper {
  id: string;
}

export interface News {
  id: string;
  ownerId: string;
  owner: string;
  ownerUrl: string;
  topic: string;
  summary: string;
  mediaParts: Array<Identifier>;
  mediaReviews: Array<Review>;
  tags: Array<string>;
  count: string;
  date: number;
  clean: boolean;
  offers: Array<string>;
}

export class Review {
  private _file_name: string;
  private _doc_description: string;
  private _doc_name: string;
  private _file_type: string;
  private _has_medium: boolean;

  constructor(
    fileName: string = '',
    desc: string = '',
    docName: string = '',
    fileType: string = '',
    hasMedium: boolean = false
  ) {
    this._file_name = fileName;
    this._doc_description = desc;
    this._doc_name = docName;
    this._file_type = fileType;
    this._has_medium = hasMedium;
  }

  public get file_name(): string {
    return this._file_name;
  }

  public get doc_description(): string {
    return this._doc_description;
  }

  public get doc_name(): string {
    return this._doc_name;
  }

  public get file_type(): string {
    return this._file_type;
  }

  public set file_name(v: string) {
    this._file_name = v;
  }

  public set doc_description(v: string) {
    this._doc_description = v;
  }

  public set doc_name(v: string) {
    this._doc_name = v;
  }

  public set file_type(v: string) {
    this._file_type = v;
  }
  public get has_medium(): boolean {
    return this._has_medium;
  }

  public set has_medium(value: boolean) {
    this._has_medium = value;
  }
}

export class NewsFeed {
  private mediaReviews: Array<Review>;
  private summary: string;
  private topic: string;
  private tags: Array<string>;
  private mediaParts: Array<string>;
  private date: number;
  private offers: Array<string>;

  constructor(
    summary: string,
    topic: string,
    tags: string[],
    mediaReviews: Review[],
    mediaParts: string[],
    date: number,
    offers: string[] = ['']
  ) {
    this.mediaReviews = mediaReviews;
    this.summary = summary;
    this.topic = topic;
    this.date = date;
    this.mediaParts = mediaParts;
    this.tags =
      tags == null
        ? ['']
        : tags.map(function (item) {
            return item.trim(); // .replace('#', '');
          });
    this.offers = offers;
  }
}
export interface Offer {
  id: string;
  ownerId: string;
  newsId: string;
  newsOwnerId: string;
  tags: Array<string>;
  mediaReviews: Array<Review>;
  mediaParts: Array<Identifier>;
  topic: string;
  summary: string;
  price: number;
  startDate: number;
  endDate: number;
  isActive: boolean;
}
export class OfferFeed {
  private newsOwnerId: string;
  private newsId: string;
  private topic: string;
  private summary: string;
  private price: number;
  private tags: Array<string>;
  private mediaReviews: Array<Review>;
  private mediaParts: Array<string>;
  private date: number;

  constructor(
    newsOwnerId: string,
    newsId: string,
    topic: string,
    summary: string,
    price: number,
    tags: string[],
    mediaReviews: Review[],
    mediaParts: string[],
    date: number
  ) {
    this.newsOwnerId = newsOwnerId;
    this.newsId = newsId;
    this.mediaReviews = mediaReviews;
    this.summary = summary;
    this.topic = topic;
    this.price = price;
    this.date = date;
    this.mediaParts = mediaParts;
    this.tags =
      tags == null
        ? ['']
        : tags.map(function (item) {
            return item.trim(); // .replace('#', '');
          });
  }
}
export class OfferPayload {
  private _id: string;
  private _ownerId: string;
  private _newsId: string;
  private _newsOwnerId: string;
  private _price: number;
  private _tags: Array<string>;
  private _topic: string;
  private _thumb: string;
  private _startDate: number;
  private _endDate: number;
  private _active: boolean;
  constructor(
    id: string,
    ownerId: string,
    newsId: string,
    newsOwnerId: string,
    price: number,
    tags: string[],
    topic: string,
    thumb: string,
    startDate: number,
    endDate: number,
    active: boolean
  ) {
    this._id = id;
    this._ownerId = ownerId;
    this._newsId = newsId;
    this._newsOwnerId = newsOwnerId;
    this._price = price;
    this._tags = tags;
    this._thumb = thumb;
    this._topic = topic;
    this._startDate = startDate;
    this._endDate = endDate;
    this._active = active;
  }
  get newsId(): string {
    return this._newsId;
  }

  set newsId(value: string) {
    this._newsId = value;
  }
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }
  get ownerId(): string {
    return this._ownerId;
  }

  set ownerId(value: string) {
    this._ownerId = value;
  }
  get newsOwnerId(): string {
    return this._newsOwnerId;
  }

  set newsOwnerId(value: string) {
    this._newsOwnerId = value;
  }
  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }
  get topic(): string {
    return this._topic;
  }

  set topic(value: string) {
    this._topic = value;
  }
  get thumb(): string {
    return this._thumb;
  }

  set thumb(value: string) {
    this._thumb = value;
  }
  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }
  get startDate(): number {
    return this._startDate;
  }

  set startDate(value: number) {
    this._startDate = value;
  }
  get endDate(): number {
    return this._endDate;
  }

  set endDate(value: number) {
    this._endDate = value;
  }
  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }
}
