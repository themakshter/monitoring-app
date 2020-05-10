import Constants from '../constants/Constants';
import Alarms from '../constants/Alarms';
import VentilationModes from '../constants/VentilationModes';

let pressureGraph = new Array(Constants.GraphLength).fill(0);
let volumeGraph = new Array(Constants.GraphLength).fill(0);
let flowRateGraph = new Array(Constants.GraphLength).fill(0);
let totalPackets = 0;
let failedPackets = 0;
let interval = 0;
let counterForGraphs = 0;

export const processSerialData = (
  packet: any,
  updateReadingStateFunction: (value: any) => void,
) => {
  totalPackets++;
  if (processIntegrityCheck(packet)) {
    interval++;
    if (interval > Constants.UpdateInterval) {
      interval = 0;

      const measuredVolume = getWordFloat(
        packet[8],
        packet[9],
        4000 / 65535,
        -2000,
      );
      addValueToGraph(measuredVolume, volumeGraph, counterForGraphs);

      const measuredFlowRate = getWordFloat(
        packet[12],
        packet[13],
        400 / 65535,
        -200,
      );
      addValueToGraph(measuredFlowRate, flowRateGraph, counterForGraphs);

      const measuredPressure = getWordFloat(
        packet[10],
        packet[11],
        90 / 65535,
        -30,
      );
      addValueToGraph(measuredPressure, pressureGraph, counterForGraphs);

      counterForGraphs++;
      if (counterForGraphs >= Constants.GraphLength) {
        counterForGraphs = 0;
      }

      const ventilationMode = getVentilationMode(packet[29]);

      let currentAlarms = getAlarmValues(packet);

      updateReadingStateFunction({
        peep: packet[26] - 30,
        measuredPressure: measuredPressure,
        plateauPressure: getWordFloat(packet[16], packet[17], 90 / 65535, -30),
        patientRate: packet[23],
        tidalVolume: getWordFloat(packet[20], packet[21], 1, 0),
        ieRatio: (packet[24] & 0x0f) + ':' + (packet[24] & 0xf0) / 16,
        vti: getWordFloat(packet[30], packet[31], 4000 / 65535, -2000),
        vte: getWordFloat(packet[32], packet[33], 4000 / 65535, -2000),
        minuteVentilation: getWordFloat(packet[34], packet[35], 40 / 65535, 0),
        inspiratoryTime: 1,
        expiratoryTime: 5,
        fiO2: packet[25],
        flowRate: measuredFlowRate,
        PIP: packet[40] - 30,
        mode: ventilationMode,
        graphPressure: pressureGraph,
        graphVolume: volumeGraph,
        graphFlow: flowRateGraph,
        packetIntegrityRatio: `${failedPackets} / ${totalPackets}`,
        alarms: currentAlarms,
      });
      totalPackets++;
    }
  } else {
    failedPackets++;
  }
};

function processIntegrityCheck(packet: any): boolean {
  if (packet.length > Constants.TotalPacketLength) {
    return false;
  }
  let crc = 0;
  for (let i = 0; i < packet.length - 2; i++) {
    crc = (crc ^ packet[i]) & 0xff;
  }
  if (crc == packet[packet.length - 2]) return true;
  else {
    var data = '';
    for (let i = 0; i < packet.length; i++) {
      data = data + ' ' + parseInt(packet[i]);
    }
    console.log('crc failed ' + data);
  }
  return false;
}

function getWordFloat(
  ByteL: number,
  ByteH: number,
  multiplier: number,
  offset: number,
): number {
  return (ByteL + ByteH * 256) * multiplier + offset;
}

function addValueToGraph(
  value: number,
  graph: number[],
  counter: number,
): void {
  graph[counter++ % Constants.GraphLength] = value;
  if (counter >= Constants.GraphLength) {
    counter = 0;
  }
  graph[counter % Constants.GraphLength] = 0;
  graph[(counter + 1) % Constants.GraphLength] = 0;
  graph[(counter + 2) % Constants.GraphLength] = 0;
}

function getAlarmValues(serialData: Array<number>): Array<string> {
  let alarms: Array<string> = [];
  var bits = 8;
  var alarmIndices = [27, 41, 42];
  for (
    let alarmIndex = 0;
    alarmIndex < bits * alarmIndices.length;
    alarmIndex++
  ) {
    let alarmIndexToCheck = Math.floor(alarmIndex / bits);
    let valueByteToCheckIndex = alarmIndices[alarmIndexToCheck];
    let valueToCheck = serialData[valueByteToCheckIndex];
    let bitIndexToCheck = alarmIndex % bits;
    let isAlarmActive = getValueOfBit(valueToCheck, bitIndexToCheck);
    if (isAlarmActive) {
      alarms.push(Alarms[alarmIndex]);
    }
  }
  return alarms;
}

function getValueOfBit(valueToParse: number, bitIndex: number) {
  const bitIndexNumberForFindingValue = [1, 2, 4, 8, 16, 32, 64, 128];
  return valueToParse & bitIndexNumberForFindingValue[bitIndex];
}

function getVentilationMode(valueToParse: number): string {
  // 0x1C is 00011100 so we find the values contain in bits 2-4
  // we also want the index to retrieve the correct mode from our array
  // so we shift the bits to the end to get the actual value
  const ventilationModeIndex = (valueToParse & 0x1c) >> 2;
  return VentilationModes[ventilationModeIndex];
}
