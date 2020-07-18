import * as RNFS from 'react-native-fs';

export default {
  internalAppDirectoryPath: RNFS.ExternalDirectoryPath,
  externalAppDirectoryPath: `${RNFS.ExternalStorageDirectoryPath}/OpenVentPk`,
};
