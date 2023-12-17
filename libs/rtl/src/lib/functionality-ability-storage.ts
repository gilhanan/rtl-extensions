import { getValue, setValue } from '@rtl-extensions/chrome';

const key = 'auto-dir-enabled';

export async function getFunctionalityAbilityValue(): Promise<boolean> {
  const value = await getValue<string>({ key });
  return !(value === 'false');
}

export async function setFunctionalityAbilityValue(
  enabled: boolean
): Promise<void> {
  await setValue({ key, value: enabled.toString() });
}
