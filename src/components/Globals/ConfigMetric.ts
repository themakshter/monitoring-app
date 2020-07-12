import styled from 'styled-components/native';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';

export const ConfigMetricWrapper = styled.View<{
  borderBottom?: string;
}>`
  flex-direction: row;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ borderBottom }) => borderBottom || Colors.borders};
  justify-content: center;
`;

export const ConfigLabelContainer = styled.View`
  border-right-width: 1px;
  border-right-color: ${Colors.borders};
  width: 80%;
  flex-direction: row;
`;

export const ConfigLabelText = styled.Text<{
  size?: string;
}>`
  color: ${Colors.textColor};
  font-size: ${({ size }) => size || FontSize.configurationLabelText};
`;

export const SwitchContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Switch = styled.TouchableOpacity<{
  background: string;
}>`
  height: 60px;
  width: 200px;
  align-items: center;
  justify-content: center;
  background-color: ${({ background }) => background};
  border-radius: 9px;
`;

export const Picker = styled.Picker`
  color: ${Colors.textColor};
  font-size: ${FontSize.connectionLabelText};
  flex: 1;
`;
