import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart, AreaChart, Grid, YAxis } from "react-native-svg-charts";
import Colors from "../constants/Colors";
import * as shape from "d3-shape";
import { useState, useEffect } from "react";

export default function Graphs(props) {
  const contentInset = { top: 20, bottom: 20 };
  const [Data, setData] = useState(props.data);
  useEffect(() => {
    setData(props.data);
  });
  return (
    <View style={{ color: "grey:" }}>
      <View>
        <View style={styles.graphwithaxis}>
          <YAxis
            data={[props.yMin, props.yMax]}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
            numberOfTicks={props.numberOfTicks}
            formatLabel={(value) => `${value}`}
            // style={{ flex: 0.3 }}
          />
          <AreaChart
            // contentInset={contentInset}
            style={styles.graph}
            yMin={props.yMin}
            yMax={props.yMax}
            data={Data}
            svg={{ fill: Colors.graphcolor }}
            // animate={true}
            // curve={shape.curveNatural}
            showGrid={true}
            numberOfTicks={props.numberOfTicks}
          >
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
    flexDirection: "row",
    flexGrow: 1,
    height: "100%",
  },
  graph: {
    width: "95%",
  },
});
