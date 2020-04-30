import * as React from 'react';
import MetricDisplay from './MetricDisplay';
import Toast from 'react-native-simple-toast';
import RNBeep from 'react-native-a-beep';

export default function AlarmMetricDisplay(props) {
  const state = getStateFromValue(props.value);

  function getStateFromValue(value) {
    if (value < props.lowerLimit || value > props.upperLimit) {
      return 'alarm';
    }
    return 'normal';
  }

  return (
    <MetricDisplay
      title={props.title}
      value={props.value}
      unit={props.unit}
      state={state}
    />
  );
}
