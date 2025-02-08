import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // if (!isProd) {
    // 这里是把api请求代理到http://hk.hellomalo.top
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://hk.hellomalo.top/api/v1/:path*", // 开发环境
      },
    ];
    // }
    // return [];
  },
  // 这里是配置图片
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // 这里是配置国际化
  i18n: {
    locales: ["en-US", "zh-CN"],
    defaultLocale: "en-US",
    localeDetection: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 关闭 ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 这里是配置输出
  output: "standalone",
};

export default nextConfig;
