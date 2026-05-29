import moment from 'moment';
import { STEP_HEIGHTS, MAX_STEP_HEIGHT_CAP } from '../constants';

/**
 * Get the shortest event duration (in minutes) across a list of raw events.
 * Events may carry start/end as Date, moment, or string - we normalize via moment
 * and ignore zero/negative durations.
 *
 * @param {Array<{start: *, end: *}>} events
 * @returns {number|null} shortest duration in minutes, or null when no events.
 */
export const getShortestEventMinutes = (events) => {
  if (!Array.isArray(events) || events.length === 0) return null;
  let shortest = null;
  events.forEach((event) => {
    if (!event || !event.start || !event.end) return;
    const minutes = moment(event.end).diff(moment(event.start), 'minutes');
    if (minutes > 0 && (shortest === null || minutes < shortest)) {
      shortest = minutes;
    }
  });
  return shortest;
};

/**
 * Compute the minimum stepHeight required so that an event whose duration is
 * `shortestMinutes` renders at least `minEventHeight` pixels tall.
 *
 * @param {Object} params
 * @param {number} params.minEventHeight - desired minimum pixel height per event box
 * @param {number} params.stepMinutes - minutes represented by one step row
 * @param {number|null} params.shortestMinutes - shortest visible event duration
 * @returns {number} the floor stepHeight in pixels (0 when not applicable).
 */
export const getFloorStepHeight = ({
  minEventHeight,
  stepMinutes,
  shortestMinutes,
}) => {
  if (!minEventHeight || minEventHeight <= 0) return 0;
  if (!shortestMinutes || shortestMinutes <= 0) return 0;
  return Math.ceil((minEventHeight * stepMinutes) / shortestMinutes);
};

/**
 * Combine the caller-provided stepHeight with the computed floor and (optional)
 * measured requirement, capping at MAX_STEP_HEIGHT_CAP to avoid runaway growth.
 *
 * @param {Object} params
 * @param {number|null} params.stepHeight - caller-provided stepHeight prop
 * @param {number} params.stepMinutes
 * @param {number} params.floorStepHeight
 * @param {number} [params.measuredStepHeight=0]
 * @returns {number}
 */
export const getEffectiveStepHeight = ({
  stepHeight,
  stepMinutes,
  floorStepHeight,
  measuredStepHeight = 0,
}) => {
  const baseStepHeight = stepHeight || STEP_HEIGHTS[stepMinutes];
  const next = Math.max(
    baseStepHeight,
    floorStepHeight || 0,
    measuredStepHeight || 0
  );
  return Math.min(MAX_STEP_HEIGHT_CAP, next);
};
