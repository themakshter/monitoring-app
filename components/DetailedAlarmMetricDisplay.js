import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import MetricDisplay from './MetricDisplay';
import Colors from '../constants/Colors';

export default function DetailedAlarmMetricDisplay(props) {
  const colour = getColourFromValue(props.value);
  const state = getStateFromValue(props.value);

  function getColourFromValue(value) {
    if (value < props.lowerLimit || value > props.upperLimit) {
      return Colors.errorText;
    }
    return Colors.graphcolor;
  }

  function getStateFromValue(value) {
    if (value < props.lowerLimit || value > props.upperLimit) {
      return 'alarm';
    }
    return 'normal';
  }

  return (
    <View style={{ color: colour, padding: 5 }}>
      <MetricDisplay
        value={props.value}
        title={props.title}
        unit={props.unit}
        state={state}
      />
      <View>
        <View style={styles.peepgaugewithaxis}>
          <YAxis
            data={[props.lowerLimit, props.upperLimit]}
            contentInset={{ top: 4, bottom: 3 }}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={10}
            style={{ flex: 1 }}
          />

          <BarChart
            // contentInset={contentInset}
            style={styles.peepgauge}
            yMin={props.lowerLimit}
            yMax={props.upperLimit}
            data={[props.value]}
            svg={{ fill: colour }}
            showGrid={true}
            numberOfTicks={6}>
            <Grid></Grid>
          </BarChart>
        </View>
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
  peepgaugewithaxis: { flexDirection: 'row', height: '80%', padding: 5 },
  peepgauge: {
    // padding: 5,
    borderWidth: 2,
    borderColor: 'grey',
    flex: 1,
    // width: "50%",
    // alignSelf: "center",
  },
});
