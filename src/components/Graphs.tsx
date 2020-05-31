import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { AreaChart, Grid, YAxis } from 'react-native-svg-charts';
import Colors from '../constants/Colors';
import Markers from './Marker';

export default function Graphs(props: any) {

  return (
    <View style={{ color: Colors.graphBarColor }}>
      <View>
        <View style={styles.graphwithaxis}>
          {/* </View> */}
          <YAxis
            data={[props.yMin, props.yMax]}
            contentInset={{ top: 5, bottom: 5 }}
            svg={{
              fill: Colors.gridLines,
              fontSize: 10,
            }}
            numberOfTicks={props.numberOfTicks}
            formatLabel={(value: number) => `${value}`}
            style={{ flex: 2 }}
          />
          <AreaChart
            style={styles.graph}
            yMin={props.yMin}
            yMax={props.yMax}
            data={props.data}
            svg={{ fill: props.fillColor, stroke: props.strokeColor, strokeWidth: 3 }}
            numberOfTicks={props.numberOfTicks}>
            <Grid numberOfTicks={2} svg={{ stroke: Colors.generalBackGround, fill: 'none' }}></Grid>
            <Markers markerIndices={props.markers} markerHeight={(props.yMax - props.yMin) * 0.1} />
          </AreaChart>
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
  graphwithaxis: {
    flexDirection: 'row',
    flexGrow: 1,
    height: '100%',
  },
  graph: {
    // paddingRight: ,
    // width: '89%',
    flex: 80,
  },
});
