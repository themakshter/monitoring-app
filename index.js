import { AppRegistry } from 'react-native';
import App from './src/App';
import { name } from './app.json';

console.log(name);
AppRegistry.registerComponent(name, () => App);
