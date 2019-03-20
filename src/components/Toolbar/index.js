import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CALENDAR_VIEWS } from '../../Calendar/constants';
import {
  CALENDAR_VIEW_TYPE,
  DATE_TYPE,
  FIRST_DAY_TYPE,
} from '../../Calendar/types';
import { makeClass } from '../../Calendar/utils';
import './index.scss';
import { getNavigateDate, getRangeTitle, useFetchEvents } from './utils';
import {
  FIRST_DAY_DEFAULT,
  FETCH_EVENT_PADDING_DEFAULT,
} from '../../Calendar/defaultProps';

const { month, week, groups } = CALENDAR_VIEWS;

const Toolbar = ({
  children,
  firstDay,
  fetchEventPadding,
  onNavigate,
  onFetchMoreEvents,
  onResetEventRange,
  onViewChange,
  selectedDate,
  view,
}) => {
  const fetchMore = useFetchEvents({
    cursorDate: selectedDate,
    monthPadding: fetchEventPadding,
  });

  const changeDate = date => {
    onNavigate(date);
    fetchMore({
      onFetchMore: onFetchMoreEvents,
      onResetRange: onResetEventRange,
    });
  };

  const title = getRangeTitle({ date: moment(selectedDate), view, firstDay });

  const onNext = () => {
    const date = new Date(
      getNavigateDate({
        view: view,
        direction: 1,
        currentDate: moment(selectedDate),
      })
    );
    changeDate(date);
  };

  const onPrev = () => {
    const date = new Date(
      getNavigateDate({
        view: view,
        direction: -1,
        currentDate: moment(selectedDate),
      })
    );
    changeDate(date);
  };

  const onToday = () => {
    changeDate(new Date());
  };

  return children ? (
    children({
      onNext,
      onPrev,
      onToday,
      onViewChange,
      selectedDate,
      title,
      view,
    })
  ) : (
    <div className={makeClass('toolbar')}>
      <div className={makeClass('toolbar__views')}>
        <button type="button" onClick={() => onViewChange(month)}>
          Month
        </button>
        <button type="button" onClick={() => onViewChange(week)}>
          Week
        </button>
        <button type="button" onClick={() => onViewChange(groups)}>
          Day
        </button>
      </div>
      <div className={makeClass('toolbar__navigate')}>
        <button type="button" onClick={onToday}>
          Today
        </button>
        <button type="button" onClick={onPrev}>
          Back
        </button>
        <button type="button" onClick={onNext}>
          Next
        </button>
      </div>
      <h1 className={makeClass('toolbar__title')}>{title}</h1>
    </div>
  );
};

Toolbar.defaultProps = {
  children: null,
  firstDay: FIRST_DAY_DEFAULT,
  fetchEventPadding: FETCH_EVENT_PADDING_DEFAULT,
  onFetchMoreEvents: () => null,
  onResetEventRange: () => null,
};

Toolbar.propTypes = {
  children: PropTypes.func,
  fetchEventPadding: PropTypes.number,
  firstDay: FIRST_DAY_TYPE,
  onFetchMoreEvents: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  onResetEventRange: PropTypes.func,
  onViewChange: PropTypes.func.isRequired,
  selectedDate: DATE_TYPE.isRequired,
  view: CALENDAR_VIEW_TYPE.isRequired,
};

export default Toolbar;