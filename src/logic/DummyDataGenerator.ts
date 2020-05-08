import Alarms from '../constants/Alarms';
import { processSerialData } from './SerialParser';

export default function dummyDataGenerator(
  updateReadingStateFunction: (value: any) => void,
  intervalFrequency: number,
) {
  let intervalFunction: number;
  let data: string = '';
  let Counter = 0;

  function getRandomValue(range: number, valueToSubtract = 0) {
    return Math.round(Math.random() * range - valueToSubtract);
  }

  function generateDummyReadings() {
    // let readings: any = {
    //   peep: getRandomValue(10),
    //   peakPressure: getRandomValue(100, 100),
    //   patientRate: getRandomValue(220),
    //   plateauPressure: getRandomValue(20),
    //   vte: getRandomValue(700),
    //   inspiratoryTime: getRandomValue(3),
    //   expiratoryTime: getRandomValue(5).toFixed(1),
    //   oxygen: getRandomValue(100),
    //   flow: getRandomValue(30, 10),
    // };
    // let patientRate = readings.patientRate;
    // let alarms = [];
    // if (patientRate > 150) {
    //   alarms.push(Alarms[0]);
    // } else if (patientRate < 150 && patientRate > 100) {
    //   alarms.push(Alarms[2]);
    // }
    // readings.alarms = alarms;
    // console.log(readings);
    // return readings;
    let Data = new Array(49);
    if (Counter < data.length) {
      for (let i = 0; i < 49; i++) {
        Data[i] = data.substring(Counter, Counter + 1).charCodeAt(0);
        Counter++;
      }

      processSerialData(Data, updateReadingStateFunction);
    }
  }

  function startGenerating() {
    var RNFS = require('react-native-fs');
    RNFS.readFileAssets('sample_data.txt', 'ascii').then((result) => {
      // console.log('GOT RESULT', result);
      data = result;
      // console.log()
      // stat the first file
    });
    intervalFunction = setInterval(() => {
      generateDummyReadings();
      // const newReadings = generateDummyReadings();
      // updateReadingStateFunction(newReadings);
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
