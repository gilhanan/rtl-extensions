const className = {
  input:
    'h-3 w-7 cursor-pointer appearance-none rounded-full bg-toggle-bar-unchecked checked:bg-toggle-bar-checked',
  after:
    "after:content-[''] after:absolute after:z-[2] after:h-4 after:w-4 after:-translate-y-0.5",
  afterCustom:
    'after:rounded-full after:bg-toggle-button-unchecked after:shadow after:transition-all',
  afterChecked:
    'checked:after:translate-x-4 checked:after:bg-toggle-button-checked',
};

export function Select() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label
          className="text-sm text-secondary cursor-pointer"
          htmlFor="toggle"
        >
          {chrome.i18n.getMessage('toggleSwitchLabel')}
        </label>
        <input
          className={Object.values(className).join(' ')}
          type="checkbox"
          role="switch"
          id="toggle"
        />
      </div>
      <p className="text-xs text-secondary">
        {chrome.i18n.getMessage('toggleSwitchDescription')}
      </p>
    </div>
  );
}

export default Select;
