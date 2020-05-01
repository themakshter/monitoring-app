import * as React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import { AreaChart, Grid, YAxis } from 'react-native-svg-charts';
import Colors from '../constants/Colors';

export default function Graphs(props: any) {
  return (
    <View style={{ color: 'grey:' }}>
      <View>
        <View style={styles.graphwithaxis}>
          <YAxis
            data={[props.yMin, props.yMax]}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={props.numberOfTicks}
            formatLabel={(value: number) => `${value}`}
            // style={{ flex: 0.3 }}
          />
          <AreaChart
            // contentInset={contentInset}
            style={styles.graph}
            yMin={props.yMin}
            yMax={props.yMax}
            data={props.data}
            svg={{ fill: Colors.graphcolor }}
            // animate={true}
            // curve={shape.curveNatural}
            // showGrid={true}
            numberOfTicks={props.numberOfTicks}>
            <Grid numberOfTicks={2}></Grid>
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
    width: '95%',
  },
});
