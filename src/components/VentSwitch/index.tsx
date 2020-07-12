import React from 'react';
import Colors from '../../constants/Colors';

import {
  ConfigLabelText,
  ConfigLabelContainer,
  ConfigMetricWrapper,
  SwitchContainer,
  Switch,
} from '../Globals/ConfigMetric';

interface VentSwitchProps {
  switchHandler: (value: boolean) => void;
  isVentilating: boolean;
}

const VentSwitch = ({ switchHandler, isVentilating }: VentSwitchProps) => {
  return (
    <ConfigMetricWrapper
      style={{
        marginLeft: 'auto',
        marginRight: 35,
        justifyContent: 'space-between',
        width: '40%',
      }}
      borderBottom="transparent">
      <ConfigLabelContainer
        style={{
          borderRightWidth: 0,
          flex: 1,
        }}>
        <ConfigLabelText size="25px">
          Ventilation {isVentilating ? 'Started' : 'Stopped'}
        </ConfigLabelText>
      </ConfigLabelContainer>
      <SwitchContainer>
        <Switch
          background={
            !isVentilating
              ? Colors.startVentilationButtonColor
              : Colors.stopVentilationButton
          }
          onPress={() => {
            switchHandler(!isVentilating);
          }}>
          <ConfigLabelText size="25px">
            {isVentilating ? 'Stop' : 'Start'}
          </ConfigLabelText>
        </Switch>
      </SwitchContainer>
    </ConfigMetricWrapper>
  );
};

export default VentSwitch;
