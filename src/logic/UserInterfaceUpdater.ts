import DataConfig from '../constants/DataConfig';
import { BreathingPhase } from '../enums/BreathingPhase';

export default function userInterfaceUpdate(
  hookUpdateFunction: (value: any) => void,
) {
  console.log('user interface created');
  let pressureGraph = new Array(DataConfig.graphLength).fill(null);
  let volumeGraph = new Array(DataConfig.graphLength).fill(null);
  let flowRateGraph = new Array(DataConfig.graphLength).fill(null);
  let interval = 0;
  let counterForGraphs = 0;
  let breathMarkers: number[] = [];
  let previousBreath: BreathingPhase = BreathingPhase.Wait;

  function onReadingReceived(reading: any) {
    updateGraphs(reading);
    updateBreathMarkers(reading.breathingPhase);
    updateCounter();
    interval++;

    if (interval > DataConfig.screenUpdateInterval) {
      interval = 0;
      addCalculatedValuesToReading(reading);
      hookUpdateFunction(reading);
    }
  }

  function updateGraphs(reading: any): void {
    addValueToGraph(reading.tidalVolume.value, volumeGraph, counterForGraphs);
    addValueToGraph(reading.flowRate, flowRateGraph, counterForGraphs);
    addValueToGraph(reading.measuredPressure, pressureGraph, counterForGraphs);
  }

  function updateBreathMarkers(breathingPhase: BreathingPhase): void {
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
  }

  function updateCounter(): void {
    counterForGraphs++;
    if (counterForGraphs >= DataConfig.graphLength) {
      counterForGraphs = 0;
    }
  }

  function addCalculatedValuesToReading(reading: any) {
    reading.graphPressure = pressureGraph;
    reading.graphVolume = volumeGraph;
    reading.graphFlow = flowRateGraph;
    reading.breathMarkers = breathMarkers;
  }

  return {
    onReadingReceived,
  };
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
