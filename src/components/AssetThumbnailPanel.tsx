import { ExternalLink, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { assetLibraryItems } from "../data/assetLibrary";
import { getVimeoOEmbedUrl, getVimeoThumbnailUrl } from "../utils/vimeoThumbnails";

export function AssetThumbnailPanel() {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Asset Library</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">Visual Reference Board</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          Vimeo-derived thumbnails
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assetLibraryItems.map((asset) => (
          <article key={asset.id} className="overflow-hidden rounded-md border border-white/10 bg-black/20">
            <a href={asset.assetUrl ?? "#"} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-video overflow-hidden bg-white/5">
                <AssetImage asset={asset} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-bone">
                  <ImageIcon size={14} />
                  {asset.visualCue}
                </div>
              </div>
            </a>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-bone">{asset.projectName}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{asset.assetType}</p>
                </div>
                <span className="rounded-full border border-clear/30 bg-clear/10 px-2.5 py-1 text-xs text-clear">
                  {asset.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
                <span>{asset.source}</span>
                {asset.assetUrl ? (
                  <a href={asset.assetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-clear hover:underline">
                    Open <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetImage({ asset }: { asset: (typeof assetLibraryItems)[number] }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(asset.thumbnailUrl ?? "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHasError(false);
    setThumbnailUrl(asset.thumbnailUrl ?? "");

    const oEmbedUrl = getVimeoOEmbedUrl(asset.assetUrl);
    if (!asset.thumbnailUrl && oEmbedUrl) {
      fetch(oEmbedUrl)
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Vimeo oEmbed failed"))))
        .then((data: { thumbnail_url?: string; thumbnail_url_with_play_button?: string }) => {
          if (!cancelled) setThumbnailUrl(data.thumbnail_url_with_play_button ?? data.thumbnail_url ?? "");
        })
        .catch(() => {
          if (!cancelled) setThumbnailUrl(getVimeoThumbnailUrl(asset.assetUrl) ?? "");
        });
    }

    return () => {
      cancelled = true;
    };
  }, [asset.assetUrl, asset.thumbnailUrl]);

  if (!thumbnailUrl || hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(45,212,127,0.12)),radial-gradient(circle_at_top_right,rgba(242,153,74,0.22),transparent_34%)] px-6 text-center">
        <ImageIcon size={32} className="text-bone/70" />
        <span className="mt-3 text-sm font-semibold text-bone">{asset.assetType}</span>
        <span className="mt-1 text-xs text-muted">Thumbnail pending</span>
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt={`${asset.projectName} thumbnail`}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
