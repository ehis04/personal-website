/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: {
    root: __dirname,
  },
  // Removed: a permissive CORS block for /api/sb-contact, a route that does not
  // exist (left over from the Supabase contact variant of the template).
};

module.exports = nextConfig;
