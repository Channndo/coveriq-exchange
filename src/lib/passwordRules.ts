/** Agent / producer accounts (Exchange): min 12 chars + letter + number + special */

const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[^a-zA-Z0-9]/;

export function validateAgentPassword(password: string): string | null {
  if (password.length < 12) {
    return "Password must be at least 12 characters.";
  }
  if (!HAS_LETTER.test(password)) {
    return "Password must include at least one letter.";
  }
  if (!HAS_NUMBER.test(password)) {
    return "Password must include at least one number.";
  }
  if (!HAS_SPECIAL.test(password)) {
    return "Password must include at least one special character (e.g. ! @ # $).";
  }
  return null;
}

export const AGENT_PASSWORD_HINT =
  "At least 12 characters with a letter, a number, and a special character.";
