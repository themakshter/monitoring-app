import { Devices } from 'react-native-serialport';

export default interface SerialDataHandlerState {
  serviceStarted: boolean;
  connected: boolean;
  usbAttached: boolean;
  output: string;
  outputArray: any[];
  deviceList: Devices;
}
