import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import MetricDisplay from './MetricDisplay';
import Colors from '../constants/Colors';

export default function DetailedAlarmMetricDisplay(props: any) {
  const colour = getColourFromValue(props.value);
  const state = getStateFromValue(props.value);

  function getColourFromValue(value: number) {
    if (value < props.lowerLimit || value > props.upperLimit) {
      return Colors.errorText;
    }
    return Colors.graphcolor;
  }

  function getStateFromValue(value: any) {
    if (value < props.lowerLimit || value > props.upperLimit) {
      return 'alarm';
    }
    return 'normal';
  }

  return (
    <View
      style={{
        color: colour,
        ...styles.gaugeRowItem,
      }}>
      <MetricDisplay
        value={props.value}
        title={props.title}
        unit={props.unit}
        state={state}
      />
      <View style={styles.peepgaugewithaxis}>
        <YAxis
          data={[props.lowerLimit, props.upperLimit]}
          contentInset={{ top: 4, bottom: 3 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          style={{
            marginRight: 5,
          }}
          numberOfTicks={5}
        />

        <BarChart
          // contentInset={contentInset}
          style={styles.peepgauge}
          yMin={props.lowerLimit}
          yMax={props.upperLimit}
          contentInset={{ top: 30, bottom: 30 }}
          data={[props.value]}
          svg={{ fill: colour }}
          showGrid={true}
          numberOfTicks={5}>
          <Grid />
        </BarChart>
      </View>
    </View>

    // <Ionicons
    //   name={props.name}
    //   size={30}
    //   style={{ marginBottom: -3 }}
    //   color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    // />
  );
}

const styles = StyleSheet.create({
  peepgaugewithaxis: {
    margin: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    flex: 1,
    width: '40%',
  },
  peepgauge: {
    borderWidth: 2,
    borderColor: 'grey',
    flex: 1,
  },
  gaugeRowItem: {
    padding: 5,
    // flex: 1,
    width: '25%',
    overflow: 'hidden',
    justifyContent: 'center',
    height: 250,
  },
});
