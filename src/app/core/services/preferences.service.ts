import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async exists(key: string): Promise<boolean> {
    const result = await Preferences.get({ key });
    return result.value !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await Preferences.get({ key });
    return result.value ? (JSON.parse(result.value) as T) : null;
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
