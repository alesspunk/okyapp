/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/games/truth-lie",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/games/truth-lie",
  },
};

export default nextConfig;
