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
    let { payload } = data;
    log.info(`Received payload: ${JSON.stringify(payload)}`);

    while (payload.length < 0) {
      // we keep extracting data from our payload until it is empty
      if (SerialBuffer.length > 0) {
        // if our SerialBuffer contains values, that means we were in the
        // middle of filling it up, so we need to keep adding values from
        // the payload until it equals the packet length before sending it
        // off for parsing
        if (
          payload.length >=
          DataConfig.totalPacketLength - SerialBuffer.length
        ) {
          // if our packet contains more values than we need to fill our buffer,
          // we will extract the number of values we need to fill our buffer,
          // send it off for parsing and empty it afterwards. Then, our while
          // loop should restart
          SerialBuffer = SerialBuffer.concat(
            payload.splice(
              0,
              DataConfig.totalPacketLength - SerialBuffer.length,
            ),
          );
          processSerialData(SerialBuffer, updateReadingStateFunction);
          SerialBuffer = [];
        } else {
          // our payload did not have enough to fill our serial buffer,
          // so we just fill it up with all the values in the payload,
          // and set it to empty so we can exit out of our while loop
          // and read the next set of data sent our way
          SerialBuffer = SerialBuffer.concat(payload);
          payload = [];
        }
      } else {
        // we did not have anything in our serial, so we need to check
        // where our data packet will start from, so we can fill in our
        // serial buffer with the values from there onwards
        if (
          payload[0] == 0x24 &&
          payload[1] == 0x4f &&
          payload[2] == 0x56 &&
          payload[3] == 0x50
        ) {
          if (payload.length >= DataConfig.totalPacketLength) {
            // Our payload contains more values than we need to fill
            // our packet for parsing, so we extract the amount needed
            // to fill our serial buffer and send it off for parsing
            // loop will restart where we will start creating the next
            // suitable packet
            SerialBuffer = SerialBuffer.concat(
              payload.splice(0, DataConfig.totalPacketLength),
            );
            processSerialData(SerialBuffer, updateReadingStateFunction);
            SerialBuffer = [];
          } else {
            // Our packet did not contain enough to fill our buffer, so we fill
            // whatever we can, and then empty our packet to ready ourselves for
            // next data read
            SerialBuffer = SerialBuffer.concat(payload);
            payload = [];
          }
        } else {
          log.info(
            'Did not find the header values - moving up one value in payload index',
          );
          payload.splice(0, 1);
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
