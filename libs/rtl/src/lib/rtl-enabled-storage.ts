import { getValue, setValue } from '@rtl-extensions/chrome';

export const RTL_ENABLED_KEY = 'auto-dir-enabled';

export async function getRTLEnabledValue(): Promise<boolean> {
  const value = await getValue<string>({ key: RTL_ENABLED_KEY });
  return !(value === 'false');
}

export async function setRTLEnabledValue(enabled: boolean): Promise<void> {
  await setValue({ key: RTL_ENABLED_KEY, value: enabled.toString() });
}
