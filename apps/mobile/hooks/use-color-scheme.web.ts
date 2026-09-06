import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
function subscribe(onStoreChange: () => void) {
  const subscription = Appearance.addChangeListener(onStoreChange);
  return () => subscription.remove();
}

function getSnapshot(): 'light' | 'dark' {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): 'light' | 'dark' {
  return 'light';
}

export function useColorScheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
