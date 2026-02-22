export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body;

  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  try {
    const ebayRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await ebayRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'eBay request failed', details: error.message });
  }
}
