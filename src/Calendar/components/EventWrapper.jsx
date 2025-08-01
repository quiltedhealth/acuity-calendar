import React from 'react';
import PropTypes from 'prop-types';
import { resetEventFormat, makeClass } from '../utils';

const getEventContainerClass = ({ className, eventClass }) => {
  if (className) {
    return `${eventClass} ${className}`;
  }
  return eventClass;
};

const EventWrapper = React.forwardRef(
  (
    {
      className,
      eventClass,
      event,
      isSelectable,
      onSelect,
      children,
      ...restProps
    },
    ref
  ) => (
    <div
      {...restProps}
      className={getEventContainerClass({ className, eventClass })}
      role="button"
      ref={ref}
      style={event.color ? { backgroundColor: event.color, '--event-color': event.color } : {}}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelectable) return false;
        onSelect({ e, event: resetEventFormat(event) });
      }}
    >
      {children}
    </div>
  )
);

EventWrapper.displayName = 'EventWrapper';

EventWrapper.defaultProps = {
  className: '',
  isSelectable: true,
  onSelect: () => null,
  eventClass: makeClass('time-grid__event'),
};

EventWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  event: PropTypes.object.isRequired,
  eventClass: PropTypes.string,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default EventWrapper;
