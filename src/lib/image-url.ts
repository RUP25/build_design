type UnsplashOptions = {
  width?: number;
  quality?: number;
};

export function getAdaptiveImageQuality(base = 75): number {
  if (typeof navigator === "undefined") return base;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (!connection) return base;
  if (connection.saveData) return 60;
  if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
    return 55;
  }
  if (connection.effectiveType === "3g") return 65;
  return base;
}

export function optimizeUnsplashUrl(url: string, options: UnsplashOptions = {}) {
  const width = options.width ?? 1280;
  const quality = options.quality ?? getAdaptiveImageQuality(75);

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("unsplash.com")) return url;

    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("q", String(quality));
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function unsplashSrcSet(
  url: string,
  widths: number[],
  quality = getAdaptiveImageQuality(75),
) {
  return widths
    .map((width) => `${optimizeUnsplashUrl(url, { width, quality })} ${width}w`)
    .join(", ");
}

export function preloadImage(src: string) {
  const img = new window.Image();
  img.src = src;
}
