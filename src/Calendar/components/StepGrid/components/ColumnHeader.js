import React from 'react';
import PropTypes from 'prop-types';
import { makeClass } from '../../../utils';
import { getTodayClass } from '../utils';
import { MOMENT_TYPE } from '../../../types';
import './ColumnHeader.scss';
import {
  MIN_WIDTH_COLUMN_DEFAULT,
  MIN_WIDTH_COLUMN_EMPTY_DEFAULT,
} from '../../../defaultProps';

const ColumnHeader = ({
  children,
  totalEventColumns,
  totalColumns,
  date,
  minWidth,
  minWidthEmpty,
}) => {
  return (
    <div
      className={`${makeClass('step-grid__header-column')}${getTodayClass(
        date
      )}`}
      style={{
        minWidth: `${totalEventColumns * minWidth || minWidthEmpty}px`,
        width: `${100 / totalColumns}%`,
      }}
    >
      {children}
    </div>
  );
};

ColumnHeader.defaultProps = {
  minWidth: MIN_WIDTH_COLUMN_DEFAULT,
  minWidthEmpty: MIN_WIDTH_COLUMN_EMPTY_DEFAULT,
};

ColumnHeader.propTypes = {
  children: PropTypes.node.isRequired,
  date: MOMENT_TYPE.isRequired,
  minWidth: PropTypes.number,
  minWidthEmpty: PropTypes.number,
  totalColumns: PropTypes.number.isRequired,
  totalEventColumns: PropTypes.number.isRequired,
};

export default ColumnHeader;