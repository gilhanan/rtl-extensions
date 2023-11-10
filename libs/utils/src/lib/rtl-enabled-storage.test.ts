import {
  RTL_ENABLED_KEY,
  getRTLEnabledValue,
  setRTLEnabledValue,
} from './rtl-enabled-storage';
import { getValue, setValue } from '@rtl-extensions/chrome';

jest.mock('@rtl-extensions/chrome');

describe('getRTLEnabledValue', () => {
  beforeEach(() => {
    (getValue as jest.Mock).mockClear();
  });

  it('should return true if the value is undefined', async () => {
    (getValue as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await getRTLEnabledValue();
    expect(result).toBe(true);
  });

  it("should return true if the value is not 'false'", async () => {
    (getValue as jest.Mock).mockResolvedValueOnce('true');
    const result = await getRTLEnabledValue();
    expect(result).toBe(true);
  });

  it("should return false if the value is 'false'", async () => {
    (getValue as jest.Mock).mockResolvedValueOnce('false');
    const result = await getRTLEnabledValue();
    expect(result).toBe(false);
  });
});

describe('setRTLEnabledValue', () => {
  beforeEach(() => {
    (setValue as jest.Mock).mockClear();
  });

  it("should set the value to 'true' if enabled is true", async () => {
    await setRTLEnabledValue(true);
    expect(setValue).toHaveBeenCalledWith({
      key: RTL_ENABLED_KEY,
      value: 'true',
    });
  });

  it("should set the value to 'false' if enabled is false", async () => {
    await setRTLEnabledValue(false);
    expect(setValue).toHaveBeenCalledWith({
      key: RTL_ENABLED_KEY,
      value: 'false',
    });
  });
});
