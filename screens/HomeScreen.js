import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { MonoText } from "../components/StyledText";
import PeepPressure from "../components/PeepPressure.js";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Graphs from "../components/Graphs";
import { PressureDisplay } from "../components/StyledText";
import { RNSerialport, definitions, actions } from "react-native-serialport";
// import Colors from "../constants/Colors";

export default function HomeScreen(props) {
  const [PeakPress, setPeakPressure] = useState(10);
  const [GraphPressure, setGraphPressure] = useState(new Array(2000).fill(0));
  const [GraphVolume, setGraphVolume] = useState(new Array(2000).fill(0));
  const [PatientRate, setPatientRate] = useState(0);
  const [ITime, setITime] = useState("1.0");
  const [VTe, setVTe] = useState(0);
  const [IERatio, setIERatio] = useState("1:2.0");
  const [Oxygen, setOxygen] = useState(21);
  const [PlateauPressure, setPlateauPressure] = useState(21);
  const [Peep, setPeep] = useState(5);

  const [SerialData, setSerialData] = React.useState([2]);
  const [state, setState] = React.useState({
    servisStarted: false,
    connected: false,
    usbAttached: false,
    output: "",
    outputArray: [],
    baudRate: "115200",
    interface: "-1",
    // sendText: "HELLO",
    returnedDataType: definitions.RETURNED_DATA_TYPES.INTARRAY,
  });

  function getWordFloat(ByteH, ByteL, multiplier, offset) {
    return (ByteL + ByteH * 256) * multiplier + offset;
  }

  function onServiceStarted(response) {
    setState({ servisStarted: true });
    if (response.deviceAttached) {
      onDeviceAttached();
    }
  }
  function onServiceStopped() {
    setState({ servisStarted: false });
  }
  function onDeviceAttached() {
    setState({ usbAttached: true });
  }
  function onDeviceDetached() {
    setState({ usbAttached: false });
  }
  function onConnected() {
    setState({ connected: true });
  }
  function onDisconnected() {
    setState({ connected: false });
  }
  function onReadData(data) {
    if (state.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      if (
        data.payload[0] == "$" &&
        data.payload[1] == "O" &&
        data.payload[2] == "V" &&
        data.payload[3] == "P"
      ) {
        setPeakPressure(
          ((data.payload[10] + data.payload[11] * 256) * 90) / 65535 - 30
        );
        setPeep(
          etWordFloat(data.payload[14], data.payload[15], 40 / 65535, -10)
        );
        setPatientRate(data.payload[23]);
        setVTe(
          getWordFloat(data.payload[8], data.payload[9], 4000 / 65535, -2000)
        );
        setOxygen(data.payload[25]);
        GraphPressure.splice(0, 1);
        setGraphPressure(
          GraphPressure.concat([
            getWordFloat(data.payload[10], data.payload[11], 90 / 65535, -30),
          ])
        );
        setGraphVolume(
          GraphVolume.concat([
            getWordFloat(data.payload[12], data.payload[13], 400 / 65535, -200),
          ])
        );
      }
      // const payload = RNSerialport.intArrayToUtf16(data.payload);
      // setState({ output: this.state.output + payload });
    }
    // } else if (
    //   state.returnedDataType === definitions.RETURNED_DATA_TYPES.HEXSTRING
    // ) {
    //   const payload = RNSerialport.hexToUtf16(data.payload);
    //   setState({ output: this.state.output + payload });
    // }
  }

  function onError(error) {
    console.error(error);
  }

  useEffect(() => {
    async function startUsbListener() {
      DeviceEventEmitter.addListener(
        actions.ON_SERVICE_STARTED,
        onServiceStarted,
        this
      );
      DeviceEventEmitter.addListener(
        actions.ON_SERVICE_STOPPED,
        onServiceStopped,
        this
      );
      DeviceEventEmitter.addListener(
        actions.ON_DEVICE_ATTACHED,
        onDeviceAttached,
        this
      );
      DeviceEventEmitter.addListener(
        actions.ON_DEVICE_DETACHED,
        onDeviceDetached,
        this
      );
      DeviceEventEmitter.addListener(actions.ON_ERROR, onError, this);
      DeviceEventEmitter.addListener(actions.ON_CONNECTED, onConnected, this);
      DeviceEventEmitter.addListener(
        actions.ON_DISCONNECTED,
        onDisconnected,
        this
      );
      DeviceEventEmitter.addListener(actions.ON_READ_DATA, onReadData, this);
      RNSerialport.setReturnedDataType(state.returnedDataType);
      RNSerialport.setAutoConnectBaudRate(parseInt(state.baudRate, 10));
      RNSerialport.setInterface(parseInt(state.interface, 10));
      RNSerialport.setAutoConnect(true);
      RNSerialport.startUsbService();
    }
    async function stopUsbListener() {
      DeviceEventEmitter.removeAllListeners();
      const isOpen = await RNSerialport.isOpen();
      if (isOpen) {
        Alert.alert("isOpen", isOpen);
        RNSerialport.disconnect();
      }
      RNSerialport.stopUsbService();
    }

    startUsbListener();
    return stopUsbListener();

    //Got the string from the serial port
  });
  function _touched() {
    // setPeakPressure(PeakPress + 1);
    // if (GraphPressure.length > 10) {
    //   GraphPressure.splice(0, 1);
    //   setGraphPressure(GraphPressure.concat([(Math.random() - 0.5) * 100]));
    // } else {
    //   setGraphPressure(GraphPressure.concat([(Math.random() - 0.5) * 100]));
    // }
    // alert("somehting");
  }
  return (
    <View style={styles.container}>
      <View style={styles.peakpressure}>
        <PeepPressure PeakPressure={PeakPress} Peep={Peep}></PeepPressure>
      </View>
      <View style={styles.valuesandgraphs}>
        <View style={styles.configuredvalues}>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"Patient Rate"}
            value={PatientRate}
            unit={"BPM"}
          ></PressureDisplay>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"Plateau Press."}
            value={PlateauPressure}
            unit={""}
          ></PressureDisplay>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"VTe"}
            value={VTe}
            unit={"ml"}
          ></PressureDisplay>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"I-Time"}
            value={ITime}
            unit={"sec"}
          ></PressureDisplay>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"I:E Ratio"}
            value={IERatio}
            unit={""}
          ></PressureDisplay>
          <PressureDisplay
            style={styles.configuredvaluedisplay}
            title={"Oxygen"}
            value={Oxygen}
            unit={""}
          ></PressureDisplay>
        </View>
        <View style={styles.graphs}>
          <View style={{ height: "50%", paddingTop: 5, paddingBottom: 0 }}>
            <Graphs
              data={GraphPressure}
              yMin={-100}
              yMax={100}
              numberOfTicks={4}
            ></Graphs>
          </View>
          <View style={{ height: "50%", paddingTop: 0, paddingBottom: 0 }}>
            <Graphs
              data={GraphVolume}
              yMin={-10}
              yMax={30}
              numberOfTicks={4}
              // style={{ maxheight: "50%" }}
            ></Graphs>
          </View>
        </View>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#fff",
    padding: 2,
  },
  peakpressure: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    flexDirection: "column",
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: "grey",
  },
  valuesandgraphs: {
    flex: 5,
    height: "100%",
    backgroundColor: "white",
    padding: 2,
  },
  configuredvalues: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: "grey",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 2,

    // width: "100%",
  },
  configuredvaluedisplay: {
    flex: 0.2,
  },
  graphs: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "space-around",
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: "grey",
    height: "100%",
    // justifyContent: "space-around",
    // flexGrow: 1,
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
