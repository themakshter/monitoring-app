import * as React from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function MetricDisplay(props) {
  const colour = getStateColour(props.state);

  function getStateColour(state) {
    switch (state) {
      case 'warning':
        return Colors.warningText;
      case 'alarm':
        return Colors.errorText;
      default:
        return 'grey';
    }
  }

  return (
    <View>
      <Text style={{ color: colour, alignSelf: 'center' }}>{props.title}</Text>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 30,
          color: colour,
        }}>
        {props.value}{' '}
        <Text style={{ alignSelf: 'center', fontSize: 15 }}>{props.unit}</Text>
      </Text>
    </View>
  );
}
