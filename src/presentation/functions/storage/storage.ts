import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 's4-v4s-pace3m-parabeIIum',
});

export async function setSavedData(key: string, data: string): Promise<void> {
  await storage.set(key, data);
}

export async function getSavedData(key: string): Promise<string | undefined> {
  return await storage.getString(key);
}
