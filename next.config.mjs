/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // Set to false for temporary redirects
      },
    ]
  },
}

export default nextConfig
