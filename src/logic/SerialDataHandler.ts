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

import { log } from './AppLogger';
import SerialDataHandlerState from '../interfaces/SerialDataHandlerState';
import { processSerialData } from './SerialParser';
import PacketsHandler from './PacketsHandler';

function SerialDataHandler() {
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
        log.info(`Devices: ${JSON.stringify(devices)}`);
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
    log.info(`Received payload: ${JSON.stringify(data.payload)}`);

    if (config.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      PacketsHandler.handleDataPacket(data.payload);
    }
  }

  function startUsbListener(parsedReadingsCallback: (value: any) => void) {
    PacketsHandler.setCallbackFunction(parsedReadingsCallback);
    PacketsHandler.setProcessFunction(processSerialData);
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
