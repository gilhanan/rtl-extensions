import { sendMessage } from '@rtl-extensions/chrome';

const action = 'FunctionalityAbility';

export interface FunctionalityAbilityMessage {
  action: typeof action;
  enabled: boolean;
}

export function isFunctionalityAbilityMessage(
  message?: FunctionalityAbilityMessage
): message is FunctionalityAbilityMessage {
  return message?.action === action;
}

export async function sendFunctionalityAbilityMessage(
  enabled: FunctionalityAbilityMessage['enabled']
): Promise<void> {
  await sendMessage<FunctionalityAbilityMessage>({
    action,
    enabled,
  });
}
