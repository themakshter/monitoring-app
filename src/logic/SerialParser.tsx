import DataConfig from '../constants/DataConfig';
import { BreathingPhase } from '../enums/BreathingPhase';
import DataLogger from './DataLogger';
import { log } from './AppLogger';
import { PacketReading } from '../interfaces/PacketReading';
import { parseDataPacket } from './DataPacketParser';

let pressureGraph = new Array(DataConfig.graphLength).fill(null);
let volumeGraph = new Array(DataConfig.graphLength).fill(null);
let flowRateGraph = new Array(DataConfig.graphLength).fill(null);
let totalPackets = 0;
let failedPackets = 0;
let interval = 0;
let counterForGraphs = 0;
let breathMarkers: number[] = [];
let previousBreath: BreathingPhase = BreathingPhase.Wait;
const dataLogger = DataLogger();

export const processSerialData = (
  packet: any,
  updateReadingStateFunction: (value: any) => void,
) => {
  totalPackets++;
  if (processIntegrityCheck(packet)) {
    interval++;

    const packetReading: PacketReading = parseDataPacket(packet);

    addValueToGraph(
      packetReading.tidalVolume.value,
      volumeGraph,
      counterForGraphs,
    );
    addValueToGraph(packetReading.flowRate, flowRateGraph, counterForGraphs);
    addValueToGraph(
      packetReading.measuredPressure,
      pressureGraph,
      counterForGraphs,
    );

    const breathingPhase = packetReading.breathingPhase;
    if (
      breathingPhase === BreathingPhase.Inspiratory &&
      previousBreath !== BreathingPhase.Inspiratory
    ) {
      breathMarkers.push(counterForGraphs);
    } else {
      breathMarkers = breathMarkers.filter(
        (value) => value !== counterForGraphs,
      );
    }
    previousBreath = breathingPhase;

    counterForGraphs++;
    if (counterForGraphs >= DataConfig.graphLength) {
      counterForGraphs = 0;
    }
    const reading: any = {
      ...packetReading,
      graphPressure: pressureGraph,
      graphVolume: volumeGraph,
      graphFlow: flowRateGraph,
      packetIntegrityRatio: `${failedPackets} / ${totalPackets}`,
      breathMarkers: breathMarkers,
    };
    dataLogger.onDataReading(packetReading);

    totalPackets++;
    if (interval > DataConfig.screenUpdateInterval) {
      interval = 0;
      updateReadingStateFunction(reading);
    }
  } else {
    failedPackets++;
  }
};

function processIntegrityCheck(packet: any): boolean {
  if (packet.length > DataConfig.totalPacketLength) {
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
    log.error('crc failed ' + data);
  }
  return false;
}

function addValueToGraph(
  value: number,
  graph: number[],
  counter: number,
): void {
  graph[counter++ % DataConfig.graphLength] = value;
  if (counter >= DataConfig.graphLength) {
    counter = 0;
  }

  addGapToGraph(graph, counter);
}

function addGapToGraph(
  graph: Array<null | number>,
  currentValueIndex: number,
): void {
  const numberOfNullValues = Math.floor(DataConfig.graphLength * 0.02); // 2 % of values should be null
  for (
    let i = currentValueIndex;
    i < currentValueIndex + numberOfNullValues;
    i++
  ) {
    graph[i % DataConfig.graphLength] = null;
  }
}
