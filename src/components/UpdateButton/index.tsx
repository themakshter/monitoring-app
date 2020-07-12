import React from 'react';
import Colors from '../../constants/Colors';

import {
  ConfigLabelText,
  ConfigLabelContainer,
  ConfigMetricWrapper,
  SwitchContainer,
  Switch
} from '../Globals/ConfigMetric';

interface ToggleUpdateProps {
  setCanUpdate: (value : boolean) => void;
  canUpdate: boolean;
}

const ToggleUpdate = ({ setCanUpdate, canUpdate }: ToggleUpdateProps) => {
  return (
    <ConfigMetricWrapper style={{
      marginLeft: 'auto',
      marginRight: 35,
      width: '40%'
    }} borderBottom='transparent' >
      <ConfigLabelContainer style={{
        borderRightWidth: 0,
        flex: 1 
      }}>
        <ConfigLabelText/>
      </ConfigLabelContainer>
      <SwitchContainer>
      <Switch
          background={canUpdate ? Colors.startVentilationButtonColor : Colors.stopVentilationButton }
          onPress={() => setCanUpdate(!canUpdate)}>
          <ConfigLabelText size='25px'>
            {canUpdate ? 'Save': 'Edit' }
          </ConfigLabelText>
        </Switch>
      </SwitchContainer>
    </ConfigMetricWrapper>
  );
};

export default ToggleUpdate;
