import * as React from 'react';
import { Text, View, StyleSheet, ViewPropTypes } from 'react-native';
import { AreaChart, Grid, YAxis } from 'react-native-svg-charts';
import Colors from '../constants/Colors';
import { RotationGestureHandler } from 'react-native-gesture-handler';

export default function Graphs(props: any) {
  return (
    <View style={{ color: 'grey:' }}>
      <View>
        <View style={styles.graphwithaxis}>
          {/* <View style={{ flex: 3 }}> */}

          {/* </View> */}
          <YAxis
            data={[props.yMin, props.yMax]}
            contentInset={{ top: 5, bottom: 5 }}
            svg={{
              fill: Colors.GridLines,
              fontSize: 10,
            }}
            numberOfTicks={props.numberOfTicks}
            formatLabel={(value: number) => `${value}`}
            style={{ flex: 2 }}
          />
          <AreaChart
            // contentInset={contentInset}
            style={styles.graph}
            yMin={props.yMin}
            yMax={props.yMax}
            data={props.data}
            svg={{ fill: Colors.graphcolor, stroke: Colors.StrokeColor }}
            // animate={true}
            // curve={shape.curveNatural}
            // showGrid={true}
            numberOfTicks={props.numberOfTicks}>
            <Grid numberOfTicks={2} svg={{ stroke: Colors.GridLines }}></Grid>
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
