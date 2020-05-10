import Constants from '../constants/Constants';
import Alarms from '../constants/Alarms';

let dummydata1 = new Array(0);
let dummydata2 = new Array(0);
let GraphPressure = new Array(Constants.GraphLength).fill(0);
let GraphVolume = new Array(Constants.GraphLength).fill(0);
let GraphFlow = new Array(Constants.GraphLength).fill(0);
let TotalPacket = 0;
let FailedPacket = 0;
let Counter = 0;
let Counter1 = 0;
let Counter2 = 0;

export const processSerialData = (
  Data: any,
  updateReadingStateFunction: (value: any) => void,
) => {
  TotalPacket++;
  if (processIntegrityCheck(Data)) {
    dummydata1 = dummydata1.concat([
      getWordFloat(Data[10], Data[11], 90 / 65535, -30),
    ]);
    dummydata2 = dummydata2.concat([
      getWordFloat(Data[8], Data[9], 4000 / 65535, -2000),
    ]);
    // console.log(dummydata1.length);
    if (dummydata1.length > Constants.UpdateInterval) {
      // GraphPressure.splice(0, dummydata1.length);
      // GraphPressure = GraphPressure.concat(dummydata1);
      // GraphVolume.splice(0, dummydata2.length);
      // GraphVolume = GraphVolume.concat(dummydata2);
      // for (var i = 0; i < dummydata2.length; i++) {
      //   GraphVolume[Counter++ % Constants.GraphLength] = dummydata2[i];
      //   if (Counter >= Constants.GraphLength) {
      //     Counter = 0;
      //   }
      // }
      // for(var i = 0; i < 3; i++){
      GraphVolume[Counter++ % Constants.GraphLength] =
        dummydata2[dummydata2.length - 1];
      if (Counter >= Constants.GraphLength) {
        Counter = 0;
      }
      GraphVolume[Counter % Constants.GraphLength] = 0;
      GraphVolume[(Counter + 1) % Constants.GraphLength] = 0;
      GraphVolume[(Counter + 2) % Constants.GraphLength] = 0;

      GraphFlow[Counter2++ % Constants.GraphLength] = getWordFloat(
        Data[12],
        Data[13],
        400 / 65535,
        -200,
      );
      if (Counter2 >= Constants.GraphLength) {
        Counter2 = 0;
      }
      GraphFlow[Counter2 % Constants.GraphLength] = 0;
      GraphFlow[(Counter2 + 1) % Constants.GraphLength] = 0;
      GraphFlow[(Counter2 + 2) % Constants.GraphLength] = 0;

      // GraphVolume[(Counter + 3) % Constants.GraphLength] = 0;
      // GraphVolume[(Counter + 4) % Constants.GraphLength] = 0;

      // for (var i = 0; i < dummydata1.length; i++) {
      //   GraphPressure[Counter1++ % Constants.GraphLength] = dummydata1[i];
      //   if (Counter1 >= Constants.GraphLength) {
      //     Counter1 = 0;
      //   }
      // }
      // for(var i = 0; i < 3; i++){

      GraphPressure[Counter1++ % Constants.GraphLength] =
        dummydata1[dummydata1.length - 1];
      if (Counter1 >= Constants.GraphLength) {
        Counter1 = 0;
      }

      GraphPressure[Counter1 % Constants.GraphLength] = 0;
      GraphPressure[(Counter1 + 1) % Constants.GraphLength] = 0;
      GraphPressure[(Counter1 + 2) % Constants.GraphLength] = 0;
      // GraphPressure[(Counter1 + 3) % Constants.GraphLength] = 0;
      // GraphPressure[(Counter1 + 4) % Constants.GraphLength] = 0;
      //   if (Counter >= Constants.GraphLength){
      //     Counter = 0;
      //   }
      // }

      //console.log(Data);
      dummydata1 = [];
      dummydata2 = [];
      var ControlMode = '';
      if ((Data[29] & 0x08) > 0) {
        ControlMode = 'AC-';
      }
      if ((Data[29] & 0x04) > 0) {
        ControlMode = ControlMode + 'PCV';
      } else ControlMode = ControlMode + 'VCV';

      let currentAlarms = getAlarmValues(Data);

      // console.log('updateing');
      updateReadingStateFunction({
        peep: Data[26] - 30,
        measuredPressure: ((Data[10] + Data[11] * 256) * 90) / 65535 - 30,
        plateauPressure: getWordFloat(Data[16], Data[17], 90 / 65535, -30),
        patientRate: Data[23], //23
        tidalVolume: getWordFloat(Data[20], Data[21], 1, 0),
        ieRatio: (Data[24] & 0x0f) + ':' + (Data[24] & 0xf0) / 16,
        vti: getWordFloat(Data[30], Data[31], 4000 / 65535, -2000),
        vte: getWordFloat(Data[32], Data[33], 4000 / 65535, -2000),
        minuteVentilation: getWordFloat(Data[34], Data[35], 40 / 65535, 0),
        inspiratoryTime: 1,
        expiratoryTime: 5,
        fiO2: Data[25], //25
        flow: 23,
        flowrate: 23,
        PIP: Data[40] - 30,
        mode: ControlMode,
        graphPressure: GraphPressure,
        graphVolume: GraphVolume,
        graphFlow: GraphFlow,
        alarms: currentAlarms,
      });
    }
  } else {
    FailedPacket++;
  }
};

function processIntegrityCheck(Data: any): boolean {
  if (Data.length > Constants.TotalPacketLength) {
    return false;
  }
  let crc = 0;
  for (let i = 0; i < Data.length - 2; i++) {
    crc = (crc ^ Data[i]) & 0xff;
  }
  if (crc == Data[Data.length - 2]) return true;
  else {
    var data = '';
    for (let i = 0; i < Data.length; i++) {
      data = data + ' ' + parseInt(Data[i]);
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
