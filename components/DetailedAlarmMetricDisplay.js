import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import MetricDisplay from './MetricDisplay';
import Toast from 'react-native-simple-toast';
import RNBeep from 'react-native-a-beep';
import Colors from '../constants/Colors';

export default function DetailedAlarmMetricDisplay(props) {
  return (
    <View style={{ color: 'grey:', padding: 5 }}>
      <MetricDisplay
        value={props.value}
        title={props.title}
        unit={props.unit}></MetricDisplay>
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
            svg={{ fill: Colors.graphcolor }}
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
