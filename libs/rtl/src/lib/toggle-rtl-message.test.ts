import { sendMessage } from '@rtl-extensions/chrome';
import {
  ToggleRTLGlobalMessage,
  isToggleRTLGlobalMessage,
  sendToggleRTLGlobalMessage,
} from './toggle-rtl-message';

const action = 'ToggleRTLGlobal';

jest.mock('@rtl-extensions/chrome', () => ({
  sendMessage: jest.fn(),
}));

describe('isToggleRTLGlobalMessage', () => {
  it('should return true for a valid message', () => {
    expect(
      isToggleRTLGlobalMessage({
        action,
      } as ToggleRTLGlobalMessage)
    ).toBe(true);
  });

  it('should return false for an invalid message', () => {
    expect(
      isToggleRTLGlobalMessage({
        action: 'InvalidAction',
      } as unknown as ToggleRTLGlobalMessage)
    ).toBe(false);
  });

  it('should return false for a undefined message', () => {
    expect(isToggleRTLGlobalMessage(undefined)).toBe(false);
  });
});

describe('sendToggleRTLGlobalMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a message when enabled is 'true'", async () => {
    const enabled = true;
    await sendToggleRTLGlobalMessage(enabled);

    expect(sendMessage).toHaveBeenCalledWith({
      action,
      enabled,
    });
  });

  it("should send a message when enabled is 'false'", async () => {
    const enabled = false;
    await sendToggleRTLGlobalMessage(enabled);

    expect(sendMessage).toHaveBeenCalledWith({
      action,
      enabled,
    });
  });
});
