import React from "react";
import styles from "./CalendarStepLines.module.css";
import { STEP_HEIGHTS, STEP_BORDER_WIDTH } from "../constants";

const CalendarStepLines = ({ totalStepsPerBlock, stepMinutes }) => {
  const extraBorderHeight = STEP_BORDER_WIDTH / totalStepsPerBlock;
  const stepHeight = STEP_HEIGHTS[stepMinutes];
  const stepHeightWithBorder = `${stepHeight + extraBorderHeight}px`;

  const times = [];
  for (let i = 0; i < 24 * totalStepsPerBlock; i += 1) {
    times.push(
      <div
        className={styles.time_block}
        key={`timeBlock${i}`}
        style={{
          height: stepHeightWithBorder
        }}
        role="button"
      />
    );
  }

  return <div className={styles.wrapper}>{times}</div>;
};

export default CalendarStepLines;