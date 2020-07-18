//config.js
import { logger, configLoggerType } from 'react-native-logs';
import { rnFsFileAsync } from 'react-native-logs/dist/transports/rnFsFileAsync';
import { ansiColorConsoleSync } from 'react-native-logs/dist/transports/ansiColorConsoleSync';
import * as RNFS from 'react-native-fs';
import { getTimestampedFilename } from '../utils/FileUtils';
import AppConfig from '../constants/AppConfig';

console.log('starting global logger');

const logDirectory: string = `${AppConfig.internalAppDirectoryPath}/app-logs`;
RNFS.mkdir(logDirectory);

const config: configLoggerType = {
  transport: (msg, level, options) => {
    ansiColorConsoleSync(msg, level, options);
    rnFsFileAsync(msg, level, {
      loggerName: getTimestampedFilename(),
      loggerPath: `${logDirectory}`,
    });
  },
};

var log = logger.createLogger(config);

if (__DEV__) {
  log.setSeverity('debug');
} else {
  log.setSeverity('info');
}

export { log };
