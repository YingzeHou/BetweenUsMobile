import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { Asset } from 'expo-asset';

import {Provider} from 'react-redux';
import store from './store'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  Promise.all([
    Asset.loadAsync([
      require('./assets/images/todobg.png'),
      require('./assets/images/bg.jpeg')
    ]),
  ]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ActionSheetProvider>
      <Provider store={store}>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
      </Provider>
      </ActionSheetProvider>
    );
  }
}
