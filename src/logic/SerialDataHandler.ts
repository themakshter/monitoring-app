import { DeviceEventEmitter } from 'react-native';
import {
  RNSerialport,
  definitions,
  actions,
  ReturnedDataTypes,
  IOnServiceStarted,
  IOnError,
  Devices,
} from 'react-native-serialport';
import DataConfig from '../constants/DataConfig';
import { processSerialData } from './SerialParser';
import { log } from './AppLogger';
import SerialDataHandlerState from '../interfaces/SerialDataHandlerState';

function SerialDataHandler() {
  let SerialBuffer = new Array(0);
  let updateReadingStateFunction: (value: any) => void;

  //to get values from two bytes
  let state: SerialDataHandlerState = {
    serviceStarted: false,
    connected: false,
    usbAttached: false,
    output: '',
    outputArray: [],
    deviceList: [],
  };

  const config = {
    baudRate: 115200,
    interface: '-1',
    returnedDataType: <ReturnedDataTypes>(
      definitions.RETURNED_DATA_TYPES.INTARRAY
    ),
  };

  function onServiceStarted(response: IOnServiceStarted) {
    state.serviceStarted = true;
    if (response.deviceAttached) {
      onDeviceAttached();
    }
    log.info('Service started');
  }

  function onServiceStopped() {
    state.serviceStarted = false;
    log.info('Service stopped');
  }

  function onDeviceAttached() {
    state.usbAttached = true;
    log.info('Device attached');
    fillDeviceList();
  }

  function fillDeviceList() {
    RNSerialport.getDeviceList()
      .then((devices: Devices) => {
        state.deviceList = devices;
        log.info(`Devices: ${devices}`);
      })
      .catch((error: IOnError) => {
        log.error(
          `Failed to retrieve device list | ${error.errorCode} | ${error.errorMessage}`,
        );
      });
  }

  function onDeviceDetached() {
    state.usbAttached = false;
    log.info('Device detached');
  }

  function onConnected() {
    state.connected = true;
    log.info('Connected');
  }

  function onDisconnected() {
    state.connected = false;
    log.info('Disconnected');
  }

  function onError(error: IOnError) {
    log.error(`An error occurred | ${error.errorCode} | ${error.errorMessage}`);
  }

  function onReadData(data: any) {
    log.info(`Received data: ${data}`);
    let RemainingData = 0;

    // var RNFS = require('react-native-fs');

    // create a path you want to write to
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    // var path = RNFS.DocumentDirectoryPath + '/logs.txt';

    // // write the file
    // RNFS.writeFile(path, data.payload, 'ascii').catch((err) => {
    //   console.log(err.message);
    // });

    if (config.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      if (SerialBuffer.length > 0) {
        if (
          data.payload.length >=
          DataConfig.totalPacketLength - SerialBuffer.length
        ) {
          RemainingData = data.payload.splice(
            0,
            DataConfig.totalPacketLength - SerialBuffer.length,
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
            if (data.payload.length >= DataConfig.totalPacketLength) {
              RemainingData = data.payload.splice(
                0,
                DataConfig.totalPacketLength,
              );
              SerialBuffer = SerialBuffer.concat(RemainingData);
              processSerialData(SerialBuffer, updateReadingStateFunction);
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

  function startUsbListener(parsedReadingsCallback: (value: any) => void) {
    updateReadingStateFunction = parsedReadingsCallback;
    addListeners();
    RNSerialport.setReturnedDataType(config.returnedDataType);
    RNSerialport.setAutoConnectBaudRate(config.baudRate);
    RNSerialport.setInterface(parseInt(config.interface, 10));
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
    log.info('Started usb service');
  }

  function addListeners(): void {
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
  }

  async function stopUsbListener() {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = await RNSerialport.isOpen();
    if (isOpen) {
      RNSerialport.disconnect();
      log.info('Disconnected from serial port');
    }
    RNSerialport.stopUsbService();
    log.info('Stopped USB service');
  }

  return {
    startUsbListener,
    stopUsbListener,
    state,
  };
}

export default SerialDataHandler();
