import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: "myapp://",
    config: {
      Root: {
        path: "root",
        screens: {
          Main: "Main",
          Parameters: "Parameters",
        },
      },
    },
  });
}
