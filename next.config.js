const { hostname } = require("os");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cefvoxotdwoctwhyfeyw.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
