import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import MetricDisplay from './MetricDisplay';
import Colors from '../constants/Colors';
import InitialReading from '../constants/InitialReading';

export default function PressureDisplay({
  measuredPressure,
  peep,
  pip,
  plateauPressure,
}: any) {
  return (
    <View style={{ color: Colors.Borders, height: '100%' }}>
      {/* <Text style={{ color: "grey", alignSelf: "center" }}>Peak Pressure</Text> */}
      <MetricDisplay
        value={measuredPressure}
        title={'Pressure'}
        unit={'cmH2O'}></MetricDisplay>
      <View style={{}}>
        <View style={styles.peepgaugewithaxis}>
          <YAxis
            data={[0, InitialReading.pressureGraph.upperLimit]}
            contentInset={{ top: 4, bottom: 3 }}
            svg={{
              fill: Colors.TextColor,
              fontSize: 10,
            }}
            numberOfTicks={6}
            formatLabel={(value: number) => `${value}`}
            style={{ flex: 1 }}
          />

          <BarChart
            // contentInset={contentInset}
            style={styles.peepgauge}
            yMin={InitialReading.pressureGraph.lowerLimit}
            yMax={InitialReading.pressureGraph.upperLimit}
            data={[measuredPressure]}
            svg={{ fill: Colors.BarColor }}
            animate={true}
            showGrid={true}
            numberOfTicks={6}>
            <Grid svg={{ stroke: Colors.GridLines }}></Grid>
          </BarChart>
          <View style={{ flex: 1 }}></View>
        </View>
        {/* <Text style={{ aligscgnSelf: "center", color: "grey" }}>PEEP</Text> */}
        <View
          style={{
            // flex: 0.5,
            justifyContent: 'space-around',
            flexDirection: 'column',
          }}>
          <MetricDisplay
            style={styles.peep}
            value={pip.value}
            title={pip.name}
            unit={pip.unit}
          />
          <MetricDisplay
            style={styles.peep}
            title={plateauPressure.name}
            value={plateauPressure.value}
            unit={plateauPressure.unit}
          />
          <MetricDisplay
            style={styles.peep}
            value={peep.value}
            title={peep.name}
            unit={peep.unit}
          />
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
  peepgaugewithaxis: {
    flexDirection: 'row',
    height: '59%',
    paddingTop: 10,
    paddingBottom: 20,
    padding: 5,
    // alignItems:
    flexGrow: 1,
    borderWidth: 2,
    borderColor: Colors.GeneralBackGround,
    borderBottomColor: Colors.Borders,
    // alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  peepgauge: {
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 2,
    borderColor: Colors.Borders,
    // width: '30%',
    // flexGrow: 1,
    flex: 1,
    // alignItems: 'center',
    // width: '50%',
    // width: 1,
    // width: '5%',
    // alignSelf: "center",
  },
  peep: {
    flex: 1,
    // margin: 5,
    // borderWidth: 2,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    // borderBottomLeftRadius: 20,
    // borderWidth: 5,
    // borderTopWidth: 2,
  },
});
