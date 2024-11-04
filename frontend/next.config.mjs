// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add the ethereum folder to module resolution paths
    config.resolve.modules.push(path.resolve(__dirname, "../ethereum"));
    return config;
  },
};

export default nextConfig;
