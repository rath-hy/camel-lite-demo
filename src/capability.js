// Extracts email addresses from a trusted instruction string.
// These become the allow-list for any tainted data that flows through the task.
export function parseAllowedRecipients(instruction) {
  const matches = instruction.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  return matches ?? [];
}

export function checkCapability(requestedRecipient, capability) {
  if (!capability.allowedRecipients.includes(requestedRecipient)) {
    return {
      allowed: false,
      reason: `"${requestedRecipient}" is not an authorized recipient for data sourced from ${capability.source}`,
    };
  }
  return { allowed: true };
}
