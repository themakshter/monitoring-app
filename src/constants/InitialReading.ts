import Constants from './Constants';

export default {
  peep: 5,
  measuredPressure: 25,
  plateauPressure: 20,
  patientRate: 10,
  tidalVolume: 200,
  ieRatio: '1:2',
  vti: 100,
  vte: 400,
  minuteVentilation: 100,
  inspiratoryTime: 3,
  expiratoryTime: 5,
  fiO2: 21,
  flowRate: 23,
  PIP: 50,
  mode: 'VCV',
  graphPressure: new Array(Constants.GraphLength).fill(40),
  graphVolume: new Array(Constants.GraphLength).fill(200),
  graphFlow: new Array(Constants.GraphLength).fill(150),
  alarms: [],
};
