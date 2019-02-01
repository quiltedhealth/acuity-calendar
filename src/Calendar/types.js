import PropTypes from "prop-types";
import moment from "moment";
import { CALENDAR_VIEWS } from "./constants";

export const FIRST_DAY_TYPE = PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]);
export const MOMENT_TYPE = PropTypes.instanceOf(moment);
export const CALENDAR_VIEW_TYPE = PropTypes.oneOf(Object.keys(CALENDAR_VIEWS));
export const EVENT_TYPE = PropTypes.shape({
  start: MOMENT_TYPE.isRequired,
  end: MOMENT_TYPE.isRequired,
  title: PropTypes.string
});
