/**
 * Supabase reports auth results in either the query string (PKCE) or the URL
 * hash (implicit flow), depending on the link type. Read both so a devotee never
 * lands on a blank or broken page.
 */
export interface AuthResultParams {
  error?: string;
  errorCode?: string;
  errorDescription?: string;
}

export function readAuthParams(): AuthResultParams {
  if (typeof window === "undefined") return {};

  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const pick = (key: string) => search.get(key) ?? hash.get(key) ?? undefined;

  const error = pick("error");
  const errorCode = pick("error_code");
  const errorDescription = pick("error_description");

  return {
    ...(error ? { error } : {}),
    ...(errorCode ? { errorCode } : {}),
    ...(errorDescription ? { errorDescription: errorDescription.replace(/\+/g, " ") } : {}),
  };
}

/** A message a devotee can act on, rather than Supabase's raw wording. */
export function friendlyAuthError(params: AuthResultParams): string | null {
  if (!params.error && !params.errorCode) return null;

  if (params.errorCode === "otp_expired" || /expired/i.test(params.errorDescription ?? "")) {
    return "That confirmation link has expired. Links are valid for a limited time. Please request a new one below.";
  }
  if (params.errorCode === "access_denied") {
    return "That link is no longer valid. It may already have been used. Please request a new one below.";
  }
  return params.errorDescription ?? "We could not confirm your email address with that link.";
}
