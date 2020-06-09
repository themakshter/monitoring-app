import * as React from 'react';
import MetricDisplay from './MetricDisplay';

export default function TidalVolumeMetricDisplay(props: any) {
  const { ventilationMode, parameter } = props;
  if (ventilationMode === 'PCV' || ventilationMode === 'AC-PCV') {
    parameter.setValue = null;
  }

  return (
    <MetricDisplay
      title={parameter.name}
      value={parameter.setValue}
      unit={parameter.unit}
    />
  );
}
