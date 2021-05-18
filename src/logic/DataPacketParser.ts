import SetParameter from '../interfaces/SetParameter';
import { getAlarmValues } from '../utils/SerialParsingHelpers';
import { PacketReading } from '../interfaces/PacketReading';
import VentilationModes from '../constants/VentilationModes';
import { BreathingPhase } from '../enums/BreathingPhase';

export function parseDataPacket(packet: number[]): PacketReading {
  const setTidalVolume = getWordFloat(packet[20], packet[21], 1, 0);
  const measuredTidalVolume = getWordFloat(
    packet[8],
    packet[9],
    4000 / 65535,
    -2000,
  );

  const tidalVolumeParameter: SetParameter = {
    name: 'Tidal Volume',
    unit: 'ml',
    setValue: setTidalVolume,
    value: measuredTidalVolume,
    lowerLimit: Math.floor(setTidalVolume - 0.15 * setTidalVolume),
    upperLimit: Math.ceil(setTidalVolume + 0.15 * setTidalVolume),
  };

  const measuredFlowRate = getWordFloat(
    packet[12],
    packet[13],
    400 / 65535,
    -200,
  );

  const measuredPressure = getWordFloat(
    packet[10],
    packet[11],
    90 / 65535,
    -30,
  );
  const breathingPhase = getBreathingPhase(packet[29]);

  const setPeep = packet[26] - 30;
  const measuredPeep = getWordFloat(packet[14], packet[15], 40 / 65535, -10);
  const peepParameter: SetParameter = {
    name: 'PEEP',
    unit: 'cmH2O',
    setValue: setPeep,
    value: measuredPeep,
    lowerLimit: 4,
    upperLimit: 21,
  };

  const setInspiratoryPressure = packet[22] - 30;

  const measuredPip = getWordFloat(packet[45], packet[46], 90 / 65535, -30);
  const pipParameter: SetParameter = {
    name: 'PIP',
    unit: 'cmH2O',
    setValue: setInspiratoryPressure,
    value: measuredPip,
    lowerLimit: setInspiratoryPressure - 5,
    upperLimit: setInspiratoryPressure + 5,
  };

  const measuredPlateauPressure = getWordFloat(
    packet[16],
    packet[17],
    90 / 65535,
    -30,
  );

  const plateauPressureParameter: SetParameter = {
    name: 'Plateau Pressure',
    unit: 'cmH2O',
    setValue: setInspiratoryPressure,
    value: measuredPlateauPressure,
    lowerLimit: setInspiratoryPressure - 2,
    upperLimit: setInspiratoryPressure + 2,
  };

  const ventilationMode = getVentilationMode(packet[29]);

  let currentAlarms = getAlarmValues(packet);

  const setFiO2lowerBound = packet[25];
  const setFiO2upperBound = packet[44];
  const measuredFiO2 = getWordFloat(packet[18], packet[19], 100 / 65535, 0);
  const fiO2Parameter: SetParameter = {
    name: 'FiO2',
    unit: '%',
    setValue: setFiO2lowerBound,
    setValueText: `${setFiO2lowerBound}-${setFiO2upperBound}`,
    value: measuredFiO2,
    lowerLimit: setFiO2lowerBound - 2,
    upperLimit: setFiO2upperBound + 2,
  };

  const setRespiratoryRate = packet[23];
  const measuredRespiratoryRate = packet[39];
  const respiratoryRateParameter: SetParameter = {
    name: 'Patient Rate',
    unit: 'BPM',
    setValue: setRespiratoryRate,
    value: measuredRespiratoryRate,
    lowerLimit: setRespiratoryRate - 1,
    upperLimit: setRespiratoryRate + 1,
  };

  const setMinuteVentilation = (setTidalVolume / 1000) * setRespiratoryRate;
  const measuredMinuteVentilation = getWordFloat(
    packet[34],
    packet[35],
    40 / 65535,
    0,
  );
  const minuteVentilationParameter: SetParameter = {
    name: 'Minute Vent.',
    unit: 'lpm',
    setValue: setMinuteVentilation,
    value: measuredMinuteVentilation,
    lowerLimit: Math.floor(setMinuteVentilation - 0.1 * setMinuteVentilation),
    upperLimit: Math.ceil(setMinuteVentilation + 0.1 * setMinuteVentilation),
  };

  const ieInhaledValue = '1.0';
  const ieExhaleValue = packet[40] * (3 / 255);
  const ieRatio = `${ieInhaledValue} : ${ieExhaleValue.toFixed(1)}`;

  const reading: PacketReading = {
    measuredPressure: measuredPressure,
    peep: peepParameter,
    pip: pipParameter,
    plateauPressure: plateauPressureParameter,
    respiratoryRate: respiratoryRateParameter,
    tidalVolume: tidalVolumeParameter,
    ieRatio: ieRatio,
    vti: getWordFloat(packet[30], packet[31], 4000 / 65535, -2000),
    vte: getWordFloat(packet[32], packet[33], 4000 / 65535, -2000),
    minuteVentilation: minuteVentilationParameter,
    fiO2: fiO2Parameter,
    flowRate: measuredFlowRate,
    mode: ventilationMode,
    alarms: currentAlarms,
    breathingPhase: breathingPhase,
  };

  return reading;
}

function getWordFloat(
  ByteL: number,
  ByteH: number,
  multiplier: number,
  offset: number,
): number {
  return (ByteL + ByteH * 256) * multiplier + offset;
}

function getVentilationMode(valueToParse: number): string {
  // 0x1C is 00011100 so we find the values contain in bits 2-4
  // we also want the index to retrieve the correct mode from our array
  // so we shift the bits to the end to get the actual value
  const ventilationModeIndex = (valueToParse & 0x1c) >> 2;
  return VentilationModes[ventilationModeIndex];
}

function getBreathingPhase(valueToParse: number): BreathingPhase {
  return valueToParse & 3;
}
