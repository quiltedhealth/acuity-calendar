import React, { useState, useMemo } from "react";
import moment from "moment";
import Calendar from "./Calendar";
import { CALENDAR_VIEWS } from "./Calendar/constants";
import { eventsMocked, getEventsByDateAndDetail } from "./Calendar/utils";

const App = () => {
  const { week } = CALENDAR_VIEWS;
  const [view, setView] = useState(week);
  const [selectedDate, setSelectedDate] = useState(moment());

  const stepMinutes = 30;
  const events = useMemo(
    () =>
      getEventsByDateAndDetail({
        events: eventsMocked,
        stepMinutes
      }),
    [eventsMocked, stepMinutes]
  );
  console.log('events: ', events);

  return (
    <Calendar
      events={events}
      view={view}
      onViewChange={setView}
      selectedDate={selectedDate}
      onNavigate={setSelectedDate}
      firstDay={0}
      onSelectEvent={event => {
        console.log(`Selected ${event.title}`);
      }}
      onSelecting={({ start, end }) =>
        console.log(`Selecting ${start} - ${end}`)
      }
      // A callback fired when a date selection is made
      onSelectSlot={start => console.log(start.toDate())}
      stepMinutes={stepMinutes}
      // What range of minutes is selectable - for new events
      // and for drag and drop
      selectMinutes={15}
    />
  );
};

export default App;
