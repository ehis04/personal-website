// Custom image loader for next/image (see images.loaderFile in next.config.js).
//
// Next.js's built-in resizer does not run on Cloudflare Workers, so images are
// pre-sized by scripts/make-image-variants.mjs and this picks the smallest one that
// is at least as wide as the browser asked for. Anything else is served as is.

const MEDIA_WIDTHS = [384, 640, 828, 1200];
const CV_WIDTHS = [640, 900, 1251];

const pick = (widths: number[], want: number) => widths.find((w) => w >= want) ?? widths[widths.length - 1];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const media = src.match(/^\/media\/(.+)\.(?:jpe?g|png)$/i);
  if (media) return `/media/${media[1]}-${pick(MEDIA_WIDTHS, width)}.webp`;

  const cv = src.match(/^\/cv\/(page-\d+)\.webp$/);
  if (cv) return `/cv/${cv[1]}-${pick(CV_WIDTHS, width)}.webp`;

  return src;
}
