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
});
