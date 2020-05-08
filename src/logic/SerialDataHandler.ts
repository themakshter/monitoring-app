import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  RNSerialport,
  definitions,
  actions,
  ReturnedDataTypes,
} from 'react-native-serialport';
import Constants from '../constants/Constants';
import { processSerialData } from './SerialParser';
export default function SerialDataHandler(
  serialParameters: any,
  updateReadingStateFunction: (value: any) => void,
) {
  let SerialBuffer = new Array(0);

  // let intervalFunction: number;

  // let serialParameters: any;
  //to get values from two bytes
  let state = {
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
  };

  function onServiceStarted(response: any) {
    state.servisStarted = true;
    // setState(state);
    // console.warn('on service start');
    if (response.deviceAttached) {
      onDeviceAttached();
    }
  }
  function onServiceStopped() {
    state.servisStarted = false;
    // setState(state);
  }
  function onDeviceAttached() {
    console.warn('Device attached');
    state.usbAttached = true;
    // setState(state);
  }
  function onDeviceDetached() {
    state.usbAttached = false;
    // setState(state);
  }
  function onConnected() {
    // console.warn('connected');
    state.connected = true;
    // setState(state);
  }
  function onDisconnected() {
    state.connected = false;
    // setState(state);
  }
  function onError(error: any) {
    console.error(error);
  }

  function onReadData(data: any) {
    let RemainingData = 0;

    // var RNFS = require('react-native-fs');

    // // create a path you want to write to
    // // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    // var path = RNFS.DocumentDirectoryPath + '/logs.txt';

    // // write the file
    // RNFS.writeFile(path, data.payload, 'ascii').catch((err) => {
    //   console.log(err.message);
    // });
    if (state.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      if (SerialBuffer.length > 0) {
        console.log('length ' + SerialBuffer.length);
        if (
          data.payload.length >=
          Constants.TotalPacketLength - SerialBuffer.length
        ) {
          RemainingData = data.payload.splice(
            0,
            Constants.TotalPacketLength - SerialBuffer.length,
          );

          SerialBuffer = SerialBuffer.concat(RemainingData);
          processSerialData(SerialBuffer, updateReadingStateFunction);
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
              console.log('len' + data.payload.length);
              RemainingData = data.payload.splice(
                0,
                Constants.TotalPacketLength,
              );
              SerialBuffer = SerialBuffer.concat(RemainingData);
              processSerialData(SerialBuffer, updateReadingStateFunction);
              SerialBuffer = [];
            } else {
              // console.log('concat partial data' + data.payload.length);
              // RemainingData = data.payload.splice();
              SerialBuffer = SerialBuffer.concat(RemainingData);
              data.payload = [];
            }
          } else {
            console.log('no head');
            data.payload.splice(0, 1);
          }
        }
      }
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
