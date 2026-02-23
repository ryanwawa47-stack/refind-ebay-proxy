export default async function handler(req, res) {
  // ---- CORS HEADERS ----
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const ebayRes = await fetch(
      https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10,
      {
        headers: {
          Authorization: Bearer ${process.env.EBAY_TOKEN},
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await ebayRes.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: 'eBay request failed',
      details: error.message
    });
  }
