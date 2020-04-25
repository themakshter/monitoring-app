import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart, Grid, YAxis } from "react-native-svg-charts";
import { PressureDisplay } from "../components/StyledText";
import Colors from "../constants/Colors";

export default function PeepPressure() {
  const data = [98];
  const fill = "rgb(134, 65, 244)";
  const contentInset = { top: 20, bottom: 20 };
  return (
    <View style={{ color: "grey:", maxHeight: "82%" }}>
      <Text style={{ color: "grey", alignSelf: "center" }}>Peak Pressure</Text>
      <PressureDisplay value={25}></PressureDisplay>
      <View>
        <View style={styles.peepgaugewithaxis}>
          <YAxis
            data={[0, 120]}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
            numberOfTicks={6}
            formatLabel={(value) => `${value}ºC`}
            style={{ flex: 0.3 }}
          />
          <BarChart
            // contentInset={contentInset}
            style={styles.peepgauge}
            yMin={0}
            yMax={120}
            data={data}
            svg={{ fill: Colors.tintColor }}
            animate={true}
            showGrid={true}
          >
            <Grid numberOfTicks={12}></Grid>
          </BarChart>
        </View>
        <Text style={{ alignSelf: "center", color: "grey" }}>
          ----------------------------
        </Text>
        <Text style={{ alignSelf: "center", color: "grey" }}>PEEP</Text>
        <PressureDisplay value={5}></PressureDisplay>
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
  peepgaugewithaxis: { flexDirection: "row", height: "65%" },
  peepgauge: {
    borderWidth: 2,
    borderColor: "grey",
    flex: 0.5,
    // width: "50%",
    // alignSelf: "center",
  },
});
