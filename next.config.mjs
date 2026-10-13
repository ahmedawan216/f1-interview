/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Without this, opening the dev server at http://127.0.0.1:PORT blocks dev scripts, React never hydrates, and the setup form silently does nothing.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
