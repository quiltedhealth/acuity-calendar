import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import Event from "../../../Event";
import { MOMENT_TYPE } from "../../../../types";
import {
  cellWidth,
  getEventsWithoutColumns,
  makeClass
} from "../../../../utils";

const monthCellStyles = {
  width: cellWidth
};

const MonthCell = ({
  date,
  events,
  isInRange,
  onSelectEvent,
  onSelectSlot
}) => {
  const eventsForCell = get(events, date.format("YYYY-MM-DD"), []);
  const eventsWithoutColumns = getEventsWithoutColumns(eventsForCell);

  return (
    <div
      className={makeClass("month__cell")}
      style={monthCellStyles}
      role="button"
      onClick={() => onSelectSlot(date)}
    >
      <h2 className={makeClass("month__date")}>{date.date()}</h2>
      {eventsWithoutColumns.length > 0 &&
        eventsWithoutColumns.map(
          event =>
            isInRange && (
              <Event
                event={event}
                key={event.id}
                onSelectEvent={onSelectEvent}
              />
            )
        )}
    </div>
  );
};

MonthCell.propTypes = {
  date: MOMENT_TYPE.isRequired,
  events: PropTypes.object.isRequired,
  isInRange: PropTypes.bool.isRequired,
  onSelectEvent: PropTypes.func.isRequired
};

export default MonthCell;