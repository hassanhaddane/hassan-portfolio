/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { qualities: [75, 82, 95] },
  devIndicators: false,
  experimental: { optimizePackageImports: ["lucide-react"] },
};
export default nextConfig;
