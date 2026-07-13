const decodeBase64Url = (segment: string): string => {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  if (typeof window === "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const segments = token.split(".");
  if (segments.length < 2) return null;

  try {
    return JSON.parse(decodeBase64Url(segments[1]));
  } catch {
    return null;
  }
};

export const getJwtSubject = (token: string): string | null => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const subject = payload.sub ?? payload.userId ?? payload.user_id ?? payload.id;
  if (subject === undefined || subject === null) return null;

  return typeof subject === "string" ? subject : String(subject);
};
