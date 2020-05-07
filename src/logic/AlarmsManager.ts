import { showMessage, hideMessage } from 'react-native-flash-message';

function AlarmsManager() {
  let currentAlarms: Array<string> = [];

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
    } else {
      displayAlarmsBanner();
    }
  }

  function displayAlarmsBanner(): void {
    const alarmsText = currentAlarms.join('\n');
    showMessage({
      message: 'Alarm(s) active',
      description: alarmsText,
      type: 'danger',
      autoHide: false,
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
