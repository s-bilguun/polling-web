/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/admin/polls/:pollid',
          destination: '/admin/polls/[pollid]',
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  