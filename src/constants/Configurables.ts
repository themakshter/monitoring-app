import VentilationModes from './VentilationModes';

export default {
  ventilationMode: {
    label: 'Ventilation Mode',
    options: VentilationModes,
  },
  ieRatio: {
    label: 'I:E Ratio',
    options: ['1:1', '1:2'],
  },
  respiratoryRate: {
    label: 'Respiratory Rate',
    unit: 'bpm',
    options: [12, 16, 20],
  },
  tidalVolume: {
    label: 'Tidal Volume',
    unit: 'ml',
    options: [200, 350, 450],
  },
  pressure: {
    label: 'Ventilation Mode',
    unit: 'cmH2O',
    options: [15, 20, 25],
  },
  flowTrigger: {
    label: 'Flow Trigger',
    unit: 'lpm',
    options: [1, 3, 5],
  },
  peep: {
    label: 'PEEP',
    unit: 'cmH20',
    options: [0, 5, 10, 15],
  },
  fiO2: {
    label: 'FiO2',
    unit: '%',
    options: [
      '20 - 30',
      '30 - 40',
      '40 - 50',
      '50 - 60',
      '60 - 70',
      '70 - 80',
      '80 - 90',
      '90 - 100',
    ],
  },
};
