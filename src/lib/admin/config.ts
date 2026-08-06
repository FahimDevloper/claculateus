// Emails allowed to access /admin and write blog content.
// This must be kept in sync with the admin check in firestore.rules.
export const ADMIN_EMAILS = ["mdfahimhasan894@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
