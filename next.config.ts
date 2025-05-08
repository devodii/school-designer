import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  /**
   * This is a workaround to avoid the canvas package from being bundled
   * because it is not supported in the browser.
   * https://www.npmjs.com/package/react-pdf
   */
  webpack: config => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig
