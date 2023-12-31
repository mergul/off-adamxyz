import { INTERSECTION_THRESHOLD_DEFAULT } from './intersection-threshold';

export function thresholdFactory(threshold: string | null): number | number[] {
  return threshold
    ? threshold.split(',').map(parseFloat)
    : INTERSECTION_THRESHOLD_DEFAULT;
}
