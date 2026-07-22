/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'roma2go.com',
      },
    ],
  },
};

export default nextConfig;
