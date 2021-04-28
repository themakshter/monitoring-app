//config.js
import {
  logger,
  configLoggerType,
  consoleTransport,
  fileAsyncTransport,
} from 'react-native-logs';
import * as RNFS from 'react-native-fs';
import { getTimestampedFilename } from '../utils/FileUtils';
import AppConfig from '../constants/AppConfig';

console.log('starting global logger');

const logDirectory: string = `${AppConfig.internalAppDirectoryPath}/app-logs`;
RNFS.mkdir(logDirectory);

const config: configLoggerType = {
  severity: __DEV__ ? 'debug' : 'info',
  transport: (props) => {
    consoleTransport(props);
    fileAsyncTransport(props);
  },
  transportOptions: {
    FS: RNFS,
    filePath: logDirectory,
    fileName: `${getTimestampedFilename()}.txt`,
  },
  dateFormat: 'utc',
};

var log = logger.createLogger(config);

export { log };
