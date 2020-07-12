export default {
  'Ventilation Mode': {
    options: ['PCV', 'VCV', 'AC-PCV', 'AC-VCV', 'CPAP'],
  },
  'I:E Ratio': {
    options: ['1:1', '1:2']
  },
  'Respiratory Rate': {
    unit: 'bpm',
    options: [12, 16, 20]
  },
  'Tidal Volume	': {
    unit: 'ml',
    options: [200, 350, 450]
  },
  'Pressure': {
    unit: 'cmH2O',
    options: [15, 20, 25]
  },
  'Flow Trigger': {
    unit: 'lpm',
    options: [1, 3, 5]
  },
  'PEEP': {
    unit: 'cmH20',
    options: [0, 5, 10, 15]
  },
  'FiO2': {
    unit: '%',
    options: [
      '20 - 30',
      '30 - 40',
      '40 - 50',
      '50 - 60',
      '60 - 70',
      '70 - 80',
      '80 - 90',
      '90 - 100'	
    ]
  }
};
