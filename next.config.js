const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 이미지 호스팅 설정
  images: {
    // 외부 이미지를 로드할 수 있는 패턴을 설정
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snqggunfctrcgwsfyqbj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = removeImports(nextConfig);
