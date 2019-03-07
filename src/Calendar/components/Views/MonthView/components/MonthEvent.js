import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import EventWrapper from '../../../EventWrapper';
import { EVENT_TYPE } from '../../../../types';
import { makeClass } from '../../../../utils';
import './MonthEvent.scss';

const getDisplayTime = time => {
  let timeMinutes = `:${time.format('mm')}`;
  if (timeMinutes === ':00') {
    timeMinutes = '';
  }
  return `${time.format('h')}${timeMinutes}${time.format('a')}`;
};

const MonthEvent = ({ event, onSelect, children, ...restProps }) => {
  return (
    <EventWrapper
      event={event}
      onSelect={onSelect}
      eventClass={makeClass('month__event')}
      {...restProps}
    >
      {children ? (
        children(event)
      ) : (
        <Fragment>
          <span className={makeClass('month__event-time')}>
            {getDisplayTime(event.start)}
          </span>
          <span className={makeClass('month__event-title')}>{event.title}</span>
        </Fragment>
      )}
    </EventWrapper>
  );
};

MonthEvent.defaultProps = {
  onSelect: () => null,
  children: null,
};

MonthEvent.propTypes = {
  children: PropTypes.func,
  event: EVENT_TYPE.isRequired,
  onSelect: PropTypes.func,
};

export default MonthEvent;
