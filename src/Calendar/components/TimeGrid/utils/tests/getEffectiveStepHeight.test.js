import moment from 'moment';
import {
  getShortestEventMinutes,
  getFloorStepHeight,
  getEffectiveStepHeight,
} from '../getEffectiveStepHeight';
import { STEP_HEIGHTS, MAX_STEP_HEIGHT_CAP } from '../../constants';

describe('getShortestEventMinutes', () => {
  it('returns null for empty or invalid input', () => {
    expect(getShortestEventMinutes(undefined)).toBeNull();
    expect(getShortestEventMinutes(null)).toBeNull();
    expect(getShortestEventMinutes([])).toBeNull();
  });

  it('returns the shortest positive duration across mixed date formats', () => {
    const base = moment('2024-01-01 09:00:00');
    const events = [
      {
        id: 'a',
        start: base.clone().format('YYYY-MM-DD HH:mm:ss'),
        end: base.clone().add(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: 'b',
        start: base.clone().add(2, 'hours').toDate(),
        end: base.clone().add(2, 'hours').add(30, 'minutes').toDate(),
      },
      {
        id: 'c',
        start: base.clone().add(4, 'hours'),
        end: base.clone().add(4, 'hours').add(15, 'minutes'),
      },
    ];
    expect(getShortestEventMinutes(events)).toBe(15);
  });

  it('ignores zero and negative durations', () => {
    const base = moment('2024-01-01 09:00:00');
    const events = [
      { id: 'zero', start: base.clone(), end: base.clone() },
      {
        id: 'valid',
        start: base.clone(),
        end: base.clone().add(45, 'minutes'),
      },
    ];
    expect(getShortestEventMinutes(events)).toBe(45);
  });
});

describe('getFloorStepHeight', () => {
  it('returns 0 when minEventHeight is falsy or non-positive', () => {
    expect(
      getFloorStepHeight({
        minEventHeight: 0,
        stepMinutes: 60,
        shortestMinutes: 30,
      })
    ).toBe(0);
    expect(
      getFloorStepHeight({
        minEventHeight: -1,
        stepMinutes: 60,
        shortestMinutes: 30,
      })
    ).toBe(0);
  });

  it('returns 0 when there are no events to reason about', () => {
    expect(
      getFloorStepHeight({
        minEventHeight: 60,
        stepMinutes: 60,
        shortestMinutes: null,
      })
    ).toBe(0);
  });

  it('scales stepHeight so the shortest event renders at least minEventHeight tall', () => {
    // 30-min event at stepMinutes=60 must be >= 60px tall => stepHeight >= 120
    expect(
      getFloorStepHeight({
        minEventHeight: 60,
        stepMinutes: 60,
        shortestMinutes: 30,
      })
    ).toBe(120);
    // 15-min event at stepMinutes=30 must be >= 60px tall => stepHeight >= 120
    expect(
      getFloorStepHeight({
        minEventHeight: 60,
        stepMinutes: 30,
        shortestMinutes: 15,
      })
    ).toBe(120);
  });
});

describe('getEffectiveStepHeight', () => {
  it('defaults to STEP_HEIGHTS[stepMinutes] when no override', () => {
    expect(
      getEffectiveStepHeight({
        stepHeight: null,
        stepMinutes: 60,
        floorStepHeight: 0,
      })
    ).toBe(STEP_HEIGHTS[60]);
  });

  it('respects an explicit stepHeight as a floor', () => {
    expect(
      getEffectiveStepHeight({
        stepHeight: 80,
        stepMinutes: 60,
        floorStepHeight: 0,
      })
    ).toBe(80);
  });

  it('takes the max of provided stepHeight, floor, and measured values', () => {
    expect(
      getEffectiveStepHeight({
        stepHeight: 65,
        stepMinutes: 60,
        floorStepHeight: 120,
        measuredStepHeight: 200,
      })
    ).toBe(200);
  });

  it('caps growth at MAX_STEP_HEIGHT_CAP', () => {
    expect(
      getEffectiveStepHeight({
        stepHeight: null,
        stepMinutes: 60,
        floorStepHeight: MAX_STEP_HEIGHT_CAP + 1000,
        measuredStepHeight: 0,
      })
    ).toBe(MAX_STEP_HEIGHT_CAP);
  });
});
