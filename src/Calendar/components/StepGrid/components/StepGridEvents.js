import React, { Fragment } from "react";
import PropTypes from "prop-types";
import EventDragDrop from "../../Event/components/EventDragDrop";
import Event from "../../Event";
import { STEP_MINUTES_TYPE } from "../../../types";
import { makeClass } from "../../../utils";
import "./StepGridEvents.scss";

const StepGridEvents = ({
  events,
  stepDetails,
  stepMinutes,
  selectMinutes,
  onSelectEvent,
  renderEvent
}) => {
  const totalColumns = Object.keys(events).length;
  const percentWidth = 100 / totalColumns - 1;

  return (
    <Fragment>
      {Object.keys(events).map(column => {
        const thisColumnEvents = events[column];
        return thisColumnEvents.map(event => {
          return (
            <EventDragDrop
              key={event.id}
              event={event}
              stepMinutes={stepMinutes}
              selectMinutes={selectMinutes}
            >
              {draggedEvent => (
                <Event
                  event={draggedEvent}
                  style={{
                    top: `${event.top}px`,
                    height: `${event.height}px`,
                    width: `${percentWidth}%`,
                    left: `${percentWidth * (column - 1)}%`
                  }}
                  onSelectEvent={onSelectEvent}
                >
                  {renderEvent}
                </Event>
              )}
            </EventDragDrop>
          );
        });
      })}
      {stepDetails &&
        stepDetails.map(stepDetail => {
          return (
            <div
              className={makeClass("step-grid__step-detail-wrapper")}
              style={{
                top: `${stepDetail.top}px`,
                height: `${stepDetail.height}px`
              }}
            />
          );
        })}
    </Fragment>
  );
};

StepGridEvents.defaultProps = {
  renderEvent: null,
  stepDetails: []
};

StepGridEvents.propTypes = {
  events: PropTypes.object.isRequired,
  stepMinutes: STEP_MINUTES_TYPE,
  onSelectEvent: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  renderEvent: PropTypes.func,
  stepDetails: PropTypes.array
};

export default StepGridEvents;
