import {
  Attribute,
  Directive,
  ElementRef,
  Inject,
  OnDestroy,
  Optional,
} from '@angular/core';
import { rootMarginFactory } from './root-margin-factory';
import { thresholdFactory } from './threshold-factory';
import { INTERSECTION_ROOT } from './intersection-root';

@Directive({
  selector: '[waIntersectionObserver]',
  exportAs: 'IntersectionObserver',
})
export class IntersectionObserverDirective
  extends IntersectionObserver
  implements OnDestroy
{
  private readonly callbacks = new Map<Element, IntersectionObserverCallback>();

  constructor(
    @Optional() @Inject(INTERSECTION_ROOT) root: ElementRef<Element> | null,
    @Attribute('waIntersectionRootMargin') rootMargin: string | null,
    @Attribute('waIntersectionThreshold') threshold: string | null
  ) {
    super(
      (entries) => {
        this.callbacks.forEach((callback, element) => {
          const filtered = entries.filter(({ target }) => target === element);

          return filtered.length && callback(filtered, this);
        });
      },
      {
        root: root && root.nativeElement,
        rootMargin: rootMarginFactory(rootMargin),
        threshold: thresholdFactory(threshold),
      }
    );
  }

  observe(target: Element, callback: IntersectionObserverCallback = () => {}) {
    super.observe(target);
    this.callbacks.set(target, callback);
  }

  unobserve(target: Element) {
    super.unobserve(target);
    this.callbacks.delete(target);
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
