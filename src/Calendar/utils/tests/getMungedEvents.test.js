import getMungedEvents from '../getMungedEvents';
import { MOCKED_EVENTS } from '../../mocks';

describe('Munged Event Object', () => {
  it('has keys that are calendar ids', () => {
    const mungedEvents = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 30,
    });

    expect(mungedEvents).toHaveProperty('5');
    expect(mungedEvents).toHaveProperty('6');
  });

  it('has keys that are dates', () => {
    const mungedEvents = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 30,
      withColumns: false,
    });

    const calendar5 = mungedEvents[5];
    const calendar6 = mungedEvents[6];

    expect(calendar5).toHaveProperty('2019-01-28');
    expect(calendar6).toHaveProperty('2019-02-12');
    expect(calendar6).toHaveProperty('2019-02-15');
  });

  it('has new keys needed for calendar', () => {
    const mungedEvents = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 30,
      withColumns: false,
    });

    const event = mungedEvents[5]['2019-01-28'][0];

    expect(event).toHaveProperty('top');
    expect(event).toHaveProperty('height');
  });

  it('scales event height and top proportionally when stepHeight grows', () => {
    const baseStepHeight = 65;
    const doubledStepHeight = 130;

    const baseMunged = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 60,
      stepHeight: baseStepHeight,
      withColumns: false,
    });
    const scaledMunged = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 60,
      stepHeight: doubledStepHeight,
      withColumns: false,
    });

    const baseEvent = baseMunged[5]['2019-01-28'][0];
    const scaledEvent = scaledMunged[5]['2019-01-28'][0];

    // Height and top both scale with stepHeight while duration/time stay the same.
    expect(scaledEvent.height).toBeGreaterThan(baseEvent.height);
    expect(scaledEvent.top).toBeGreaterThan(baseEvent.top);
    expect(scaledEvent.start.format()).toBe(baseEvent.start.format());
    expect(scaledEvent.end.format()).toBe(baseEvent.end.format());

    // Ratio should be close to 2x (allowing for STEP_BORDER_WIDTH adjustments).
    const heightRatio = scaledEvent.height / baseEvent.height;
    expect(heightRatio).toBeGreaterThan(1.9);
    expect(heightRatio).toBeLessThan(2.1);
  });
});
