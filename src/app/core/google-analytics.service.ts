import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let ga: Function;

// notes you may need to do this as well: npm install --save-dev @types/google.analytics
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService implements OnDestroy {
  private subscription: Subscription;
  private readonly onDestroy = new Subject<void>();
  constructor(private router: Router) {
    this.subscription = new Subscription();
  }
  public subscribe() {
    if (!this.subscription) {
      // subscribe to any router navigation and once it ends, write out the google script notices
      this.subscription = this.router.events
        .pipe(takeUntil(this.onDestroy))
        .subscribe((e) => {
          if (e instanceof NavigationEnd) {
            // this will find & use the ga function pulled via the google scripts
            try {
              ga('set', 'page', e.urlAfterRedirects);
              ga('send', 'pageview');
              //   console.log(`logging: ${e.urlAfterRedirects} to google analytics`);
            } catch {
              //  console.log('tracking not found - make sure you installed the scripts');
            }
          }
        });
    }
  }

  public unsubscribe() {
    if (this.subscription) {
      // --- clear our observable subscription
      this.subscription.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
