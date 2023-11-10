import { sendMessage } from '@rtl-extensions/chrome';

const action = 'ToggleRTLGlobal';

export interface ToggleRTLGlobalMessage {
  action: typeof action;
  enabled: boolean;
}

export function isToggleRTLGlobalMessage(
  message?: ToggleRTLGlobalMessage
): message is ToggleRTLGlobalMessage {
  return message?.action === action;
}

export async function sendToggleRTLGlobalMessage(
  enabled: ToggleRTLGlobalMessage['enabled']
): Promise<void> {
  await sendMessage<ToggleRTLGlobalMessage>({
    action,
    enabled,
  });
}
