import React from "react";
import PropTypes from "prop-types";

const CalendarDayView = ({ eventOverlap }) => {
  return <div>Day View</div>;
};

CalendarDayView.defaultProps = {
  eventOverlap: false
};

CalendarDayView.propTypes = {
  eventOverlap: PropTypes.bool
};

export default CalendarDayView;