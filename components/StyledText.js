import * as React from "react";
import { Text, View } from "react-native";

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function PressureDisplay(props) {
  return (
    <View>
      <Text style={{ color: "grey", alignSelf: "center" }}>{props.title}</Text>
      <Text
        style={{
          alignSelf: "center",
          fontSize: 30,
          color: "grey",
        }}
      >
        {props.value}{" "}
        <Text style={{ alignSelf: "center", fontSize: 15 }}>{props.unit}</Text>
      </Text>
    </View>
  );
}
