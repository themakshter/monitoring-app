import styled from 'styled-components/native';

export const MetricContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const CurrentValueContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const Value = styled.Text<{
  color: string;
}>`
  color: ${({ color }) => color};
  font-size: 40px;
`;

export const Unit = styled.Text`
  margin-top: 20px;
  font-size: 20px;
`;
export const LimitsContainer = styled.View`
  flex: 1;
`;

export const ValueWrapper = styled.View`
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;

export const LimitWrapper = styled.View`
  flex: 1;
  justify-content: center;
`;

export const LimitValue = styled.Text`
  text-align: center;
  font-size: 30px;
  color: red;
`;

export const PresetValue = styled.Text`
  text-align: center;
  font-size: 30px;
`;
