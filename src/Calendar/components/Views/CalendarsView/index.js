import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import get from 'lodash/get';
import StepGrid from '../../StepGrid';
import Column from '../../StepGrid/components/Column';
import { MOMENT_TYPE, FIRST_DAY_TYPE, STEP_MINUTES_TYPE } from '../../../types';
import { TIME_GUTTER_WIDTH } from '../../StepGrid/constants';
import { useElementWidths } from '../../StepGrid/utils';
import { getEventColumnsByGroup } from '../../StepGrid/utils/getEventColumns';
import ColumnHeader from '../../StepGrid/components/ColumnHeader';
import {
  MIN_WIDTH_COLUMN_DEFAULT,
  MIN_WIDTH_COLUMN_EMPTY_DEFAULT,
} from '../../../defaultProps';

const getEventsForDay = ({ events, groupId, selectedDate }) => {
  return get(events, `${groupId}.${selectedDate.format('YYYY-MM-DD')}`, false);
};

const CalendarsView = ({
  selectedDate,
  selectedEventGroups,
  renderEventGroupHeader,
  firstDay,
  stepMinutes,
  minWidthColumn,
  minWidthColumnEmpty,
  onDragEnd,
  onExtendEnd,
  onCurrentTimeChange,
  onSelectEvent,
  onSelectSlot,
  onSelectRangeEnd,
  selectMinutes,
  stepDetailsWithEventGroups,
  eventsWithEventGroups,
  timeGutterWidth,
  renderEvent,
  renderCorner,
  renderStepDetail,
  renderSelectSlotIndicator,
  renderSelectRange,
}) => {
  const { assignRef, elementWidths } = useElementWidths();

  const eventsWithColumns = getEventColumnsByGroup(eventsWithEventGroups);

  return (
    <StepGrid
      selectedDate={selectedDate}
      firstDay={firstDay}
      onCurrentTimeChange={onCurrentTimeChange}
      stepMinutes={stepMinutes}
      selectMinutes={selectMinutes}
      timeGutterWidth={timeGutterWidth}
      renderCorner={renderCorner}
      renderHeader={() => {
        const totalColumns = selectedEventGroups.length;
        return selectedEventGroups.map(groupId => {
          const eventsForDay = getEventsForDay({
            events: eventsWithColumns,
            groupId,
            selectedDate,
          });
          const totalEventColumns = Object.keys(eventsForDay).length;
          return (
            <ColumnHeader
              key={`calendarHeader${groupId}`}
              totalEventColumns={totalEventColumns}
              totalColumns={totalColumns}
              date={selectedDate}
              minWidth={minWidthColumn}
              minWidthEmpty={minWidthColumnEmpty}
            >
              {renderEventGroupHeader({
                groupId,
                events: eventsForDay,
              })}
            </ColumnHeader>
          );
        });
      }}
      renderColumns={({ currentTime, columnWidths }) => {
        const getNewGroupId = ({ columnMoves, columnIndex }) => {
          const newIndex = columnIndex + columnMoves;
          return selectedEventGroups[newIndex];
        };

        return selectedEventGroups.map((groupId, index) => {
          const eventsForDay =
            getEventsForDay({
              events: eventsWithColumns,
              groupId,
              selectedDate,
            }) || {};

          const stepDetailsForDay =
            getEventsForDay({
              events: stepDetailsWithEventGroups,
              groupId,
              selectedDate,
            }) || [];
          return (
            <Column
              ref={assignRef(groupId)}
              key={`groupColumn${groupId}`}
              events={eventsForDay}
              stepDetails={stepDetailsForDay}
              date={selectedDate}
              columnId={groupId}
              columnWidths={elementWidths}
              columnIndex={index}
              onDragEnd={onDragEnd}
              onExtendEnd={onExtendEnd}
              onSelectEvent={onSelectEvent}
              onSelectRangeEnd={onSelectRangeEnd}
              onSelectSlot={onSelectSlot}
              stepMinutes={stepMinutes}
              selectMinutes={selectMinutes}
              currentTime={currentTime}
              renderEvent={renderEvent}
              renderStepDetail={renderStepDetail}
              renderSelectSlotIndicator={renderSelectSlotIndicator}
              renderSelectRange={renderSelectRange}
              getUpdatedDraggedEvent={({ event, columnMoves }) => {
                return {
                  ...event,
                  group_id: getNewGroupId({ columnMoves, columnIndex: index }),
                };
              }}
            />
          );
        });
      }}
    />
  );
};

CalendarsView.defaultProps = {
  renderCorner: () => null,
  renderEvent: null,
  timeGutterWidth: TIME_GUTTER_WIDTH,
  selectedDate: moment(),
  onExtendEnd: () => null,
  onCurrentTimeChange: () => null,
  onDragEnd: () => null,
  onSelectRangeEnd: () => null,
  stepDetailsWithEventGroups: null,
  minWidthColumn: MIN_WIDTH_COLUMN_DEFAULT,
  minWidthColumnEmpty: MIN_WIDTH_COLUMN_EMPTY_DEFAULT,
  renderStepDetail: () => null,
  renderSelectSlotIndicator: null,
  renderSelectRange: null,
};

CalendarsView.propTypes = {
  eventsWithEventGroups: PropTypes.object.isRequired,
  firstDay: FIRST_DAY_TYPE.isRequired,
  minWidthColumn: PropTypes.number,
  minWidthColumnEmpty: PropTypes.number,
  onCurrentTimeChange: PropTypes.func,
  onDragEnd: PropTypes.func,
  onExtendEnd: PropTypes.func,
  onSelectEvent: PropTypes.func.isRequired,
  onSelectRangeEnd: PropTypes.func,
  onSelectSlot: PropTypes.func.isRequired,
  renderCorner: PropTypes.func,
  renderEvent: PropTypes.func,
  renderEventGroupHeader: PropTypes.func.isRequired,
  renderSelectRange: PropTypes.func,
  renderSelectSlotIndicator: PropTypes.func,
  renderStepDetail: PropTypes.func,
  selectMinutes: STEP_MINUTES_TYPE.isRequired,
  selectedDate: MOMENT_TYPE,
  selectedEventGroups: PropTypes.arrayOf(PropTypes.number).isRequired,
  stepDetailsWithEventGroups: PropTypes.object,
  stepMinutes: STEP_MINUTES_TYPE.isRequired,
  timeGutterWidth: PropTypes.number,
};

export default CalendarsView;
