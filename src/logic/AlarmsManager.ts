import { showMessage, hideMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import Layout from '../constants/Layout';

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
    const widthForBanner = Layout.window.width * 0.9;
    const textAlign = 'center';
    showMessage({
      message: 'Alarm(s) active',
      description: alarmsText,
      type: 'danger',
      icon: 'warning',
      autoHide: false,
      hideOnPress: false,
      onPress: () => {
        // TODO: Create complex alarms object to check priority value instead
        if (!currentAlarms.includes('High Peak Pressure')) {
          alarmSound.stop();
        }
      },
      titleStyle: { textAlign: textAlign, width: widthForBanner, fontSize: 20 },
      textStyle: { textAlign: textAlign, width: widthForBanner, fontSize: 16 },
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
