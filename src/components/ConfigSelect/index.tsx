import React from 'react';

import {
  ConfigLabelText,
  ConfigLabelContainer,
  ConfigMetricWrapper,
  SwitchContainer,
  Picker,
} from '../Globals/ConfigMetric';

interface ConfigSelectProps {
  label: string;
  unit: string | undefined;
  pickerItems: Array<{
    value: string | number;
  }>;
  isEditable: boolean;
  settingsHandler: (key: string, value: string | boolean) => void;
  selectedValue?: string;
}

const ConfigSelect = ({
  label,
  unit,
  pickerItems,
  isEditable,
  settingsHandler,
  selectedValue,
}: ConfigSelectProps) => {
  return (
    <ConfigMetricWrapper>
      <ConfigLabelContainer>
        <ConfigLabelText>{label}</ConfigLabelText>
      </ConfigLabelContainer>
      <SwitchContainer>
        <Picker
          enabled={isEditable}
          selectedValue={selectedValue}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => settingsHandler(label, itemValue)}>
          {pickerItems.map((value) => (
            <Picker.Item
              key={`${value}`}
              label={`${value} ${unit || ''}`}
              value={value}
            />
          ))}
        </Picker>
      </SwitchContainer>
    </ConfigMetricWrapper>
  );
};

export default ConfigSelect;
