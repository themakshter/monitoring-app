import * as React from 'react';
import { View, Text, StyleSheet, ShadowPropTypesIOS } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import MetricDisplay from '../components/MetricDisplay';
import Colors from '../constants/Colors';
import { useState, useEffect } from 'react';

export default function PeepPressure(props) {
  const data = [98];
  const fill = 'rgb(134, 65, 244)';
  const contentInset = { top: 20, bottom: 20 };
  const [PeakPressure, setPeakPressure] = useState(props.PeakPressure);

  useEffect(() => {
    setPeakPressure(props.PeakPressure);
  });

  return (
    <View style={{ color: 'grey:', maxHeight: '82%' }}>
      {/* <Text style={{ color: "grey", alignSelf: "center" }}>Peak Pressure</Text> */}
      <MetricDisplay
        value={PeakPressure}
        title={'Peak Pressure'}
        unit={'cmH2O'}></MetricDisplay>
      <View>
        <View style={styles.peepgaugewithaxis}>
          <YAxis
            data={[0, 120]}
            contentInset={{ top: 4, bottom: 3 }}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={6}
            formatLabel={(value) => `${value}`}
            style={{ flex: 0.3 }}
          />

          <BarChart
            // contentInset={contentInset}
            style={styles.peepgauge}
            yMin={0}
            yMax={120}
            data={[PeakPressure]}
            svg={{ fill: Colors.graphcolor }}
            animate={true}
            showGrid={true}
            numberOfTicks={6}>
            <Grid></Grid>
          </BarChart>
        </View>
        <Text style={{ alignSelf: 'center', color: 'grey' }}>
          ----------------------------
        </Text>
        {/* <Text style={{ alignSelf: "center", color: "grey" }}>PEEP</Text> */}
        <MetricDisplay value={5} title={'PEEP'} unit={'cmH20'}></MetricDisplay>
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
  peepgaugewithaxis: { flexDirection: 'row', height: '62%', padding: 5 },
  peepgauge: {
    // padding: 5,
    borderWidth: 2,
    borderColor: 'grey',
    flex: 0.5,
    // width: "50%",
    // alignSelf: "center",
  },
});
