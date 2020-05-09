import React from 'react';
import { View } from 'react-native';
import Colors from '../../constants/Colors';

import {
  MetricContainer,
  Value,
  Unit,
  CurrentValueContainer,
  LimitsContainer,
  LimitWrapper,
  LimitValue,
  PresetValue,
  ValueWrapper,
} from './styles';
import SetParameter from 'src/interfaces/SetParameter';

const MetricCard = ({
  metric,
  state,
}: {
  metric: SetParameter;
  state: string;
}) => {
  const { upperLimit, lowerLimit, setValue, value, unit } = metric;

  const colour = getStateColour(state);
  function getStateColour(stateColor: string) {
    switch (stateColor) {
      case 'warning':
        return Colors.warningText;
      case 'alarm':
        return Colors.errorText;
      default:
        return 'grey';
    }
  }

  return (
    <MetricContainer>
      <LimitsContainer>
        <LimitWrapper>
          <LimitValue>{upperLimit.toFixed(1)}</LimitValue>
        </LimitWrapper>
        <LimitWrapper>
          <LimitValue>{lowerLimit}</LimitValue>
        </LimitWrapper>
      </LimitsContainer>
      <CurrentValueContainer>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PresetValue>{setValue}</PresetValue>
        </View>
        <ValueWrapper>
          <Value color={colour}>{value.toFixed(0)}</Value>
          <Unit>{unit}</Unit>
        </ValueWrapper>
      </CurrentValueContainer>
    </MetricContainer>
  );
};

export default MetricCard;
