import makeClass from '../../utils/makeClass';

/**
 * The height of steps at each "stepMinutes" range in pixels. The total height of the
 * block gets slightly bigger at each step. 5 is minutes per step, 10 is 10 minutes per
 * step etc. Prolly overengineered as we prolly won't use more than 30
 */
export const STEP_HEIGHTS = {
  5: 22,
  10: 27,
  15: 31,
  20: 34,
  30: 42,
  60: 65,
};
export const STEP_BORDER_WIDTH = 1;
/**
 * Minimum pixel height an event box should occupy for its content to stay readable.
 * When auto-grow is active, the grid increases stepHeight so that even the shortest
 * visible event renders at least this tall. Defaults to 0 so row height is driven
 * purely by measured content; consumers can opt-in to a visual floor by passing
 * a positive `minEventHeight` prop.
 */
export const MIN_EVENT_HEIGHT_DEFAULT = 0;
/**
 * Upper bound on computed stepHeight to guard against runaway growth if a consumer
 * renders absurdly tall content or reports a stale measurement.
 */
export const MAX_STEP_HEIGHT_CAP = 500;
export const handleCenterClass = makeClass('time-grid__event-handle-center');
export const extendHandleClass = makeClass('time-grid__event-handle');
