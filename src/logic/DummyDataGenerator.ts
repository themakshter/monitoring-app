import Alarms from '../constants/Alarms';

export default function dummyDataGenerator(
  updateReadingStateFunction: (value: any) => void,
  intervalFrequency: number,
) {
  let intervalFunction: number;

  function getRandomValue(range: number, valueToSubtract = 0) {
    return Math.round(Math.random() * range - valueToSubtract);
  }

  function generateDummyReadings() {
    let readings: any = {
      peep: getRandomValue(10),
      peakPressure: getRandomValue(100, 100),
      patientRate: getRandomValue(220),
      plateauPressure: getRandomValue(20),
      vte: getRandomValue(700),
      inspiratoryTime: getRandomValue(3),
      expiratoryTime: getRandomValue(5).toFixed(1),
      oxygen: getRandomValue(100),
      flow: getRandomValue(30, 10),
    };
    let patientRate = readings.patientRate;
    let alarms = [];
    if (patientRate > 150) {
      alarms.push(Alarms[0]);
    } else if (patientRate < 150 && patientRate > 100) {
      alarms.push(Alarms[2]);
    }
    readings.alarms = alarms;
    //console.log(readings);
    return readings;
  }

  function startGenerating() {
    intervalFunction = setInterval(() => {
      const newReadings = generateDummyReadings();
      updateReadingStateFunction(newReadings);
    }, intervalFrequency);
  }

  function stopGenerating() {
    clearInterval(intervalFunction);
  }

  return {
    startGenerating,
    stopGenerating,
  };
}
