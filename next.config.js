/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js cannot resize images on Cloudflare Workers, so images are pre-sized by
  // scripts/make-image-variants.mjs and picked by this loader.
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },

  turbopack: {
    root: __dirname,
  },
  // One canonical host: send www.ehisoghina.com to ehisoghina.com (permanent), keeping path and query.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ehisoghina.com" }],
        destination: "https://ehisoghina.com/:path*",
        permanent: true,
      },
    ];
  },
  // Baseline security headers for every page and API response. The microphone is
  // allowed for this site only, because the chat page offers dictation.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
        ],
      },
    ];
  },
  // Removed: a permissive CORS block for /api/sb-contact, a route that does not
  // exist (left over from the Supabase contact variant of the template).
};

module.exports = nextConfig;
