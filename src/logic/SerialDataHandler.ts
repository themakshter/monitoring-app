import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  RNSerialport,
  definitions,
  actions,
  ReturnedDataTypes,
} from 'react-native-serialport';
import Constants from '../constants/Constants';
export default function SerialDataHandler(
  serialParameters: any,
  updateReadingStateFunction: (value: any) => void,
) {
  let SerialBuffer = new Array(0);
  let dummydata1 = new Array(0);
  let dummydata2 = new Array(0);
  let GraphPressure = new Array(Constants.GraphLength).fill(0);
  let GraphVolume = new Array(Constants.GraphLength).fill(0);
  // let intervalFunction: number;

  // let serialParameters: any;
  //to get values from two bytes
  const [state, setState] = React.useState({
    servisStarted: false,
    connected: false,
    usbAttached: false,
    output: '',
    outputArray: [],
    baudRate: serialParameters.baudRate,
    interface: '-1',
    returnedDataType: <ReturnedDataTypes>(
      definitions.RETURNED_DATA_TYPES.INTARRAY
    ),
  });
  function getWordFloat(
    ByteH: number,
    ByteL: number,
    multiplier: number,
    offset: number,
  ): number {
    return (ByteL + ByteH) * 256 * multiplier + offset;
  }
  function onServiceStarted(response: any) {
    state.servisStarted = true;
    setState(state);
    // console.warn('on service start');
    if (response.deviceAttached) {
      onDeviceAttached();
    }
  }
  function onServiceStopped() {
    state.servisStarted = false;
    setState(state);
  }
  function onDeviceAttached() {
    console.warn('Device attached');
    state.usbAttached = true;
    setState(state);
  }
  function onDeviceDetached() {
    state.usbAttached = false;
    setState(state);
  }
  function onConnected() {
    // console.warn('connected');
    state.connected = true;
    setState(state);
  }
  function onDisconnected() {
    state.connected = false;
    setState(state);
  }
  function onError(error: any) {
    console.error(error);
  }

  function onReadData(data: any) {
    let RemainingData = 0;
    if (state.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      if (SerialBuffer.length > 0) {
        if (
          data.payload.length >=
          Constants.TotalPacketLength - SerialBuffer.length
        ) {
          RemainingData = data.payload.splice(
            0,
            Constants.TotalPacketLength - SerialBuffer.length,
          );

          SerialBuffer = SerialBuffer.concat(RemainingData);
          processSerialData(SerialBuffer);
          SerialBuffer = [];
        } else {
          SerialBuffer = SerialBuffer.concat(data.payload);
        }
      } else {
        while (data.payload.length > 0) {
          if (
            data.payload[0] == 0x24 &&
            data.payload[1] == 0x4f &&
            data.payload[2] == 0x56 &&
            data.payload[3] == 0x50
          ) {
            if (data.payload.length >= Constants.TotalPacketLength) {
              RemainingData = data.payload.splice(
                0,
                Constants.TotalPacketLength,
              );
              SerialBuffer = SerialBuffer.concat(RemainingData);
              processSerialData(SerialBuffer);
              SerialBuffer = [];
            } else {
              SerialBuffer = SerialBuffer.concat(RemainingData);
              data.payload = [];
            }
          } else {
            data.payload.splice(0, 1);
          }
        }
      }
    }
  }

  function processSerialData(Data: any) {
    dummydata1 = dummydata1.concat([
      getWordFloat(Data[10], Data[11], 90 / 65535, -30),
    ]);
    dummydata2 = dummydata2.concat([
      getWordFloat(Data[12], Data[13], 400 / 65535, -200),
    ]);
    // console.log(dummydata1.length);
    if (dummydata1.length > Constants.UpdateInterval) {
      GraphPressure.splice(0, dummydata1.length);
      GraphPressure = GraphPressure.concat(dummydata1);
      GraphVolume.splice(0, dummydata2.length);
      GraphVolume = GraphVolume.concat(dummydata2);
      dummydata1 = [];
      dummydata2 = [];
      updateReadingStateFunction({
        peep: getWordFloat(Data[14], Data[15], 40 / 65535, -10),
        peakPressure: ((Data[10] + Data[11] * 256) * 90) / 65535 - 30,
        // patientRate: getRandomValue(220),
        plateauPressure: 20,
        patientRate: Data[23],
        vte: getWordFloat(Data[8], Data[9], 4000 / 65535, -2000),
        inspiratoryTime: 3,
        expiratoryTime: 5,
        oxygen: Data[25],
        flow: 23,
        graphPressure: GraphPressure,
        graphVolume: GraphVolume,
      });
    }
  }

  async function startUsbListener() {
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STARTED,
      onServiceStarted,
    );
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STOPPED,
      onServiceStopped,
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_ATTACHED,
      onDeviceAttached,
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_DETACHED,
      onDeviceDetached,
    );
    DeviceEventEmitter.addListener(actions.ON_ERROR, onError);
    DeviceEventEmitter.addListener(actions.ON_CONNECTED, onConnected);
    DeviceEventEmitter.addListener(actions.ON_DISCONNECTED, onDisconnected);
    DeviceEventEmitter.addListener(actions.ON_READ_DATA, onReadData);
    RNSerialport.setReturnedDataType(state.returnedDataType);
    RNSerialport.setAutoConnectBaudRate(parseInt(state.baudRate, 10));
    RNSerialport.setInterface(parseInt(state.interface, 10));
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
    console.log('started usb service');
  }
  async function stopUsbListener() {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = RNSerialport.isOpen();
    if (isOpen) {
      // Alert.alert('isOpen', isOpen);
      RNSerialport.disconnect();
    }
    RNSerialport.stopUsbService();
  }

  return {
    startUsbListener,
    stopUsbListener,
    state,
  };
}
