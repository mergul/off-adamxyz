export class FirebaseUserModel {
  id: string;
  image: string;
  name: string;
  email: string;
  totalNews: string;
  people: string[];
  tags: string[];
  followers: string[];
  provider: string;
  mediaParts: number[];
  token: string;
  iban: string;
  offers: string[];

  constructor() {
    this.id = '';
    this.image = '';
    this.name = '';
    this.email = '';
    this.totalNews = '';
    this.people = [];
    this.tags = [];
    this.followers = [];
    this.provider = '';
    this.mediaParts = [];
    this.token = '';
    this.iban = '';
    this.offers = [];
  }
}

export class UserTag {
  id: string;
  email: string;
  tag: string;
  constructor(id: string = '', email: string = '', tag: string = '') {
    this.id = id;
    this.email = email;
    this.tag = tag;
  }
}

export interface User {
  blocked: string[];
  iban: string;
  contentsCount: string;
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  tags: string[];
  users: string[];
  followers: string[];
  image: string;
  mediaParts: number[];
  roles: string[];
  summary: string;
  enabled: boolean;
  offers: string[];
}

export interface BalanceRecord {
  key: string;
  paymentKey: string;
  pageviews: number;
  payment: number;
  totalViews: number;
  payedViews: number;
  totalBalance: number;
  date: number;
}
