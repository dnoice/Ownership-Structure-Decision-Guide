export default function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing code" });
  }

  const adminCode = process.env.ADMIN_CODE;

  if (!adminCode) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const valid = code.trim() === adminCode;

  return res.status(200).json({ valid });
}
