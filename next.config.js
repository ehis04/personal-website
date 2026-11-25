/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every page is static, so the site is built to plain files (the `out` folder) that Cloudflare
  // serves directly. Security/cache headers live in public/_headers; the only server code is
  // worker/index.ts (the chat API).
  output: "export",

  // Next.js cannot resize images on Cloudflare Workers, so images are pre-sized by
  // scripts/make-image-variants.mjs and picked by this loader.
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },

  turbopack: {
    root: __dirname,
  },
  // Removed: a permissive CORS block for /api/sb-contact, a route that does not
  // exist (left over from the Supabase contact variant of the template).
};

module.exports = nextConfig;
