/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: { optimizePackageImports: ["lucide-react"] },
};
export default nextConfig;
