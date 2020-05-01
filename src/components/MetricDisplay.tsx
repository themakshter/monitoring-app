import * as React from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function MetricDisplay(props: any) {
  const colour = getStateColour(props.state);

  function getStateColour(state: string) {
    switch (state) {
      case 'warning':
        return Colors.warningText;
      case 'alarm':
        return Colors.errorText;
      default:
        return 'grey';
    }
  }
  // console.log('metric ' + props.title);
  return (
    <View>
      <Text style={{ color: colour, alignSelf: 'center' }}>{props.title}</Text>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 30,
          color: colour,
        }}>
        {parseFloat(props.value).toFixed(0)}{' '}
        <Text style={{ alignSelf: 'center', fontSize: 15 }}>{props.unit}</Text>
      </Text>
    </View>
  );
}
