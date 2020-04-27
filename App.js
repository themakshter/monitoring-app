import * as React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  DeviceEventEmitter,
  NativeModules,
} from "react-native";
import * as Font from "expo-font";
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import useLinking from "./navigation/useLinking";

import { useState, useEffect } from "react";

import { RNSerialport } from "react-native-serialport";
// import { DeviceEventEmitter } from "react-native";

const Stack = createStackNavigator();

const definitions = {
  DATA_BITS: {
    DATA_BITS_5: 5,
    DATA_BITS_6: 6,
    DATA_BITS_7: 7,
    DATA_BITS_8: 8,
  },
  STOP_BITS: {
    STOP_BITS_1: 1,
    STOP_BITS_15: 3,
    STOP_BITS_2: 2,
  },
  PARITIES: {
    PARITY_NONE: 0,
    PARITY_ODD: 1,
    PARITY_EVEN: 2,
    PARITY_MARK: 3,
    PARITY_SPACE: 4,
  },
  FLOW_CONTROLS: {
    FLOW_CONTROL_OFF: 0,
    FLOW_CONTROL_RTS_CTS: 1,
    FLOW_CONTROL_DSR_DTR: 2,
    FLOW_CONTROL_XON_XOFF: 3,
  },
  RETURNED_DATA_TYPES: {
    INTARRAY: 1,
    HEXSTRING: 2,
  },
  DRIVER_TYPES: {
    AUTO: "AUTO",
    CDC: "cdc",
    CH34x: "ch34x",
    CP210x: "cp210x",
    FTDI: "ftdi",
    PL2303: "pl2303",
  },
};

const actions = {
  ON_SERVICE_STARTED: "onServiceStarted",
  ON_SERVICE_STOPPED: "onServiceStopped",
  ON_DEVICE_ATTACHED: "onDeviceAttached",
  ON_DEVICE_DETACHED: "onDeviceDetached",
  ON_ERROR: "onError",
  ON_CONNECTED: "onConnected",
  ON_DISCONNECTED: "onDisconnected",
  ON_READ_DATA: "onReadDataFromPort",
};

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
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
        setSerialData(data.paylaod);
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

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Icon.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    function startUsbListener() {
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

    loadResourcesAndDataAsync();
    startUsbListener();
    return stopUsbListener();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    // alert("app started");
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer
          ref={containerRef}
          initialState={initialNavigationState}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              initialParams={[34, 45]}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
