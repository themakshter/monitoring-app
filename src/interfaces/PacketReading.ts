import { BreathingPhase } from '../enums/BreathingPhase';
import SetParameter from './SetParameter';

export interface PacketReading {
  measuredPressure: number;
  peep: SetParameter;
  pip: SetParameter;
  plateauPressure: SetParameter;
  respiratoryRate: SetParameter;
  tidalVolume: SetParameter;
  ieRatio: string;
  vti: number;
  vte: number;
  minuteVentilation: SetParameter;
  fiO2: SetParameter;
  flowRate: number;
  mode: string;
  alarms: string[];
  breathingPhase: BreathingPhase;
}
