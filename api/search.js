import { getEbayAccessToken } from "./ebayAuth.js";

const EBAY_ENV = process.env.EBAY_ENV || "production";
const EBAY_API_BASE =
  EBAY_ENV === "sandbox"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const accessToken = await getEbayAccessToken();

    const ebayRes = await fetch(
      `${EBAY_API_BASE}/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await ebayRes.json();
    return res.status(ebayRes.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "eBay request failed",
      details: error.message,
    });
  }
}
