import {MMKV} from 'react-native-mmkv';
import {constants} from '../../constants';

const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 's4-v4s-pace3m-parabeIIum',
});

export async function setSavedData(data: string): Promise<void> {
  await storage.set(constants.HOME.STORAGE_KEY, data);
}

export async function getSavedData(): Promise<string | undefined> {
  return await storage.getString(constants.HOME.STORAGE_KEY);
}
