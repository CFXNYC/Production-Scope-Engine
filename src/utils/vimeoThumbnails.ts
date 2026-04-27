export function extractVimeoId(url?: string) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d{6,12})(?:[/?#]|$)/i);
  return match?.[1] ?? null;
}

export function getVimeoThumbnailUrl(url?: string) {
  const videoId = extractVimeoId(url);
  return videoId ? `https://vumbnail.com/${videoId}.jpg` : null;
}

export function getVimeoOEmbedUrl(url?: string) {
  if (!url || !extractVimeoId(url)) return null;
  return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
}
