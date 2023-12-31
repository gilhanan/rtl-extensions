import { useEffect, useState } from 'react';
import {
  getFunctionalityAbilityValue,
  sendFunctionalityAbilityMessage,
  setFunctionalityAbilityValue,
} from '@rtl-extensions/rtl';
import { Select } from './select';

export function Settings() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  async function loadSettings() {
    setEnabled(await getFunctionalityAbilityValue());
    setLoading(false);
  }

  function onEnabledChange(enabled: boolean) {
    setFunctionalityAbilityValue(enabled);
    setEnabled(enabled);
    sendFunctionalityAbilityMessage(enabled);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium text-primary">
        {chrome.i18n.getMessage('settings')}
      </h2>
      <Select loading={loading} value={enabled} onChange={onEnabledChange} />
    </div>
  );
}

export default Settings;
