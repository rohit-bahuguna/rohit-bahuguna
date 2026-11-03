export async function purgeCloudflareCache(urls: string[] = ["/"]) {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const domain = process.env.CLOUDFLARE_DOMAIN || "http://localhost:3000";

  if (!zoneId || !token) {
    // Cloudflare edge purge skipped if credentials are not configured (e.g. local dev)
    return { success: true, skipped: true, reason: "No Cloudflare credentials configured" };
  }

  const fullUrls = urls.map((u) => (u.startsWith("http") ? u : `${domain}${u}`));

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: fullUrls }),
    });

    const data = await res.json();
    if (!data.success) {
      console.error("[Cloudflare Purge Error]:", data.errors);
      return { success: false, errors: data.errors };
    }
    return { success: true, data };
  } catch (err) {
    console.error("[Cloudflare Network Error]:", err);
    return { success: false, error: err };
  }
}
