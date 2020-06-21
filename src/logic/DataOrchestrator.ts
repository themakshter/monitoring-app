import UserInterfaceUpdater from './UserInterfaceUpdater';
import DataLogger from './DataLogger';
import { processSerialData } from './SerialParser';
import SerialDataHandler from './SerialDataHandler';
import DummyDataGenerator from './DummyDataGenerator';
import SerialDataRetriever from 'src/interfaces/SerialDataRetriever';
import DataConfig from '../constants/DataConfig';

function DataOrchestrator() {
  console.log('creating orchestrator');
  let userInterfaceUpdater: any;
  const dataLogger = DataLogger();
  let dataPacketRetriever: SerialDataRetriever;

  function onPacketReceived(dataPacket: any) {
    processSerialData(dataPacket, onDataParsed);
  }

  function onDataParsed(reading: any) {
    userInterfaceUpdater.onReadingReceived(reading);
    dataLogger.onDataReading(reading);
  }

  function startOrchestrating(
    hookUpdateFunction: (value: any) => void,
    testMode: boolean = false,
  ) {
    dataPacketRetriever = createDataRetriever(testMode);
    userInterfaceUpdater = UserInterfaceUpdater(hookUpdateFunction);
    console.log('starting orchestrator');
    dataPacketRetriever.start();
  }

  function createDataRetriever(isTestMode: boolean) {
    if (isTestMode) {
      return DummyDataGenerator(onPacketReceived, DataConfig.dataFrequency);
    } else {
      return SerialDataHandler({ baudRate: 115200 }, onPacketReceived);
    }
  }

  function stopOrchestrating() {
    dataPacketRetriever.stop();
  }

  return {
    startOrchestrating,
    stopOrchestrating,
  };
}

export default DataOrchestrator();
