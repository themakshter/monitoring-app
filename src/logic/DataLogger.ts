import * as RNFS from 'react-native-fs';
import Alarms from '../constants/Alarms';
import SetParameter from '../interfaces/SetParameter';
import DataConfig from '../constants/DataConfig';
import { BreathingPhase } from '../enums/BreathingPhase';
import { log } from './AppLogger';
import { getTimestampedFilename, createDirectory } from '../utils/FileUtils';
import { PacketReading } from '../interfaces/PacketReading';

// TODO: Add serial data packets also
export default function dataLogger() {
  const logFile: string = getTimestampedFilename('', '.csv');
  const logDirectoryCreationPromise = createDirectory('sessions');
  let readingsCsv: string[] = [getDataHeaders()];
  const logFrequency: number =
    (DataConfig.graphLength / DataConfig.dataFrequency) * 1000; // log every time the graph clears

  setInterval(() => {
    if (readingsCsv.length > 0) {
      writeToLogFile(readingsCsv.length);
    }
  }, logFrequency);

  function getDataHeaders() {
    return [
      'Timestamp',
      'Measured Pressure (cmH2O)',
      getSetParameterHeader('Peep', 'cmH2O'),
      getSetParameterHeader('PIP', 'cmH2O'),
      getSetParameterHeader('Plateau Pressure', 'cmH2O'),
      getSetParameterHeader('Patient Rate', 'BPM'),
      getSetParameterHeader('Tidal Volume', 'ml'),
      'I/E Ratio',
      'VTi (ml)',
      'VTe (ml)',
      getSetParameterHeader('Minute Ventilation', 'lpm'),
      getSetParameterHeader('FiO2', '%'),
      'Flow Rate (lpm)',
      'Ventilation Mode',
      'Breathing Phase',
      getAlarmHeaders(),
    ].join(',');
  }

  function getSetParameterHeader(name: string, unit: string) {
    return [
      `${name} Set Value (${unit})`,
      `${name} Measured Value (${unit})`,
      `${name} Lower Limit (${unit})`,
      `${name} Upper Limit (${unit})`,
    ].join(',');
  }

  function getAlarmHeaders() {
    return Alarms.join(',');
  }

  function onDataReading(reading: PacketReading) {
    const readingInCsv = getCsvFormat(reading);
    readingsCsv.push(readingInCsv);
  }

  function writeToLogFile(numberOfReadingsAdded: number) {
    const readingsToAdd: string = readingsCsv.join('\n');
    logDirectoryCreationPromise.then((logDirectoryPath) => {
      const logFilePath: string = `${logDirectoryPath}/${logFile}`;
      RNFS.write(logFilePath, readingsToAdd + '\n')
        .then(() => {
          log.info(`written to ${logFilePath}`);
          readingsCsv = readingsCsv.slice(numberOfReadingsAdded);
        })
        .catch((err) => {
          log.error(err.message);
        });
    });
  }

  function getCsvFormat(reading: PacketReading): string {
    const {
      peep,
      measuredPressure,
      plateauPressure,
      respiratoryRate,
      tidalVolume,
      ieRatio,
      vti,
      vte,
      minuteVentilation,
      fiO2,
      flowRate,
      pip,
      mode,
      alarms,
      breathingPhase,
    } = reading;
    let readingsString: string = [
      new Date().toISOString(),
      measuredPressure,
      getSetParameterCsvFormat(peep),
      getSetParameterCsvFormat(pip),
      getSetParameterCsvFormat(plateauPressure),
      getSetParameterCsvFormat(respiratoryRate),
      getSetParameterCsvFormat(tidalVolume),
      ieRatio,
      vti,
      vte,
      getSetParameterCsvFormat(minuteVentilation),
      getSetParameterCsvFormat(fiO2),
      flowRate,
      mode,
      BreathingPhase[breathingPhase],
      getAlarmsInCsvFormat(alarms),
    ].join(',');
    return readingsString;
  }

  function getSetParameterCsvFormat(paramter: SetParameter) {
    return [
      paramter.setValueText || paramter.setValue,
      paramter.value,
      paramter.lowerLimit,
      paramter.upperLimit,
    ].join(',');
  }

  function getAlarmsInCsvFormat(alarms: string[]): string {
    let alarmPresenceArray: boolean[] = new Array(Alarms.length).fill(false);
    for (let i = 0; i < Alarms.length; i++) {
      if (alarms.includes(Alarms[i])) {
        alarmPresenceArray[i] = true;
      }
    }
    return alarmPresenceArray.join(',');
  }

  return {
    onDataReading,
  };
}
