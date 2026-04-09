/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "your-backend-domain.com",
      "res.cloudinary.com",
      process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost:5000",
      "ojukwu-chukwuebuka.onrender.com", // production backend if needed
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ]
  }
};
module.exports = nextConfig;
