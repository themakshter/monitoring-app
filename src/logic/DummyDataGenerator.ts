import { processSerialData } from './SerialParser';

export default function dummyDataGenerator(
  updateReadingStateFunction: (value: any) => void,
  intervalFrequency: number,
) {
  let intervalFunction: number;
  let data: string = '';
  let Counter = 0;

  function generateDummyReadings() {
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
    RNFS.readFileAssets('sample_data.txt', 'ascii').then((result: any) => {
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
