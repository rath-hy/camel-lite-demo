export function checkCapability(requestedRecipient, capability) {
  if (!capability.allowedRecipients.includes(requestedRecipient)) {
    return {
      allowed: false,
      reason: `${requestedRecipient} is not an authorized recipient for data sourced from ${capability.source}`,
    };
  }
  return { allowed: true };
}
