const EBAY_ENV = process.env.EBAY_ENV || "production";
const BASE_URL =
  EBAY_ENV === "sandbox"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com";

const CLIENT_ID = (process.env.EBAY_CLIENT_ID || "").trim();
const CLIENT_SECRET = (process.env.EBAY_CLIENT_SECRET || "").trim();
const SCOPE =
  process.env.EBAY_SCOPE || "https://api.ebay.com/oauth/api_scope";

let cachedToken = null;
let expiresAtMs = 0;

export async function getEbayAccessToken() {
  const now = Date.now();

  if (cachedToken && now < expiresAtMs - 60_000) {
    return cachedToken;
  }
    if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing EBAY_CLIENT_ID or EBAY_CLIENT_SECRET");
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const tokenRes = await fetch(`${BASE_URL}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: SCOPE,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Token request failed: ${tokenRes.status} ${text}`);
  }

  const tokenData = await tokenRes.json();
  cachedToken = tokenData.access_token;
  expiresAtMs = now + (tokenData.expires_in || 7200) * 1000;

  return cachedToken;
}
