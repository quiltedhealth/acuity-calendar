import getEventsWithEventGroups from '../getEventsWithEventGroups';
import getMungedEvents from '../getMungedEvents';
import { MOCKED_EVENTS } from '../../mocks';

describe('Munged Event Object', () => {
  it('Must have an event from two calendars', () => {
    const mungedEvents = getMungedEvents({
      events: MOCKED_EVENTS,
      stepMinutes: 30,
      withColumns: false,
    });

    const events = getEventsWithEventGroups({
      mungedEvents,
      selectedEventGroups: [5, 6],
    });

    const hasEvent3 = events['2019-02-12'].some((event) => {
      return event.id === 3;
    });

    const hasEvent5 = events['2019-02-11'].some((event) => {
      return event.id === 5;
    });

    expect(hasEvent3).toBeTruthy();
    expect(hasEvent5).toBeTruthy();
  });
});
