import * as React from "react";
import { Text } from "react-native";

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function PressureDisplay(props) {
  return (
    <Text
      style={{
        alignSelf: "center",
        fontSize: 30,
        color: "grey",
      }}
    >
      {props.value}{" "}
      <Text style={{ alignSelf: "center", fontSize: 15 }}>cmH20</Text>
    </Text>
  );
}
