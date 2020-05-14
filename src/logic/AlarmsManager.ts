import { showMessage, hideMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

function AlarmsManager() {
  let currentAlarms: Array<string> = [];
  let alarmSound = new Sound('alarm.mp3');

  function onNewReading(reading: any) {
    const newAlarms: any = reading.alarms;
    if (newAlarms === undefined) {
      return;
    }
    if (changeInAlarms(newAlarms)) {
      currentAlarms = newAlarms;
      handleCurrentAlarms(currentAlarms);
    }
  }

  function handleCurrentAlarms(alarms: Array<string>): void {
    if (alarms.length === 0) {
      hideMessage();
      alarmSound.stop();
    } else {
      displayAlarmsBanner();
    }
  }

  function displayAlarmsBanner(): void {
    const alarmsText = currentAlarms.join('\n');
    alarmSound.play();
    alarmSound.setNumberOfLoops(-1);

    showMessage({
      message: 'Alarm(s) active',
      description: alarmsText,
      type: 'danger',
      autoHide: false,
      hideOnPress: true,
      onPress: () => {
        alarmSound.stop();
      },
    });
  }

  function changeInAlarms(newAlarms: Array<string>): boolean {
    if (currentAlarms.length !== newAlarms.length) {
      return true;
    } else {
      return !currentAlarms.every((value, index) => {
        return value === newAlarms[index];
      });
    }
  }

  return {
    onNewReading,
  };
}

export default AlarmsManager();
