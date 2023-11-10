import { Select } from './select';

export function Settings() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium text-primary">
        {chrome.i18n.getMessage('settings')}
      </h2>
      <Select />
    </div>
  );
}

export default Settings;
