import type { ApplySituationValue } from "@/lib/apply-situations";
import { APPLY_SITUATION_VALUES } from "@/lib/apply-situations";
import type { MessageTree } from "@/lib/i18n/messages";

export function situationLabel(value: string, t: MessageTree): string {
  const k = value as ApplySituationValue;
  if ((APPLY_SITUATION_VALUES as readonly string[]).includes(k)) {
    return t.situations[k];
  }
  return value;
}
