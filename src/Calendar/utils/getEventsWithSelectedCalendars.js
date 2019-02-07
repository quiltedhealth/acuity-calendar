/**
 * Flatten the object of munged events to ONLY selected calendar events
 *
 * @param {Object} params
 * @param {Object} params.mungedEvents - These events need to be keyed all fun for this function to work
 * @param {array} params.selectedCalendars - An array of selected calendar ids
 */
const getEventsWithSelectedCalendars = ({
  mungedEvents,
  selectedCalendars
}) => {
  const newEvents = Object.assign({}, mungedEvents);
  Object.keys(newEvents).forEach(calendarId => {
    if (!selectedCalendars.includes(Number(calendarId))) {
      delete newEvents[calendarId];
    }
  });

  const selectedCalendarEvents = Object.keys(newEvents).reduce(
    (accumulator, calendarId) => {
      return Object.assign(accumulator, newEvents[calendarId]);
    },
    {}
  );
  return selectedCalendarEvents;
};

export default getEventsWithSelectedCalendars;