const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "github.com",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },
          {
            protocol: "https",
            hostname: "utfs.io",
          },
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
          },
        ],
      },
};
 
module.exports = withNextIntl(nextConfig);

// const nextConfig = {
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: "https",
    //       hostname: "github.com",
    //     },
    //     {
    //       protocol: "https",
    //       hostname: "lh3.googleusercontent.com",
    //     },
    //     {
    //       protocol: "https",
    //       hostname: "utfs.io",
    //     },
    //     {
    //       protocol: "https",
    //       hostname: "avatars.githubusercontent.com",
    //     },
    //   ],
    // },
//   };
  
//   const withNextIntl = require("next-intl/plugin")("./i18n.ts");
  
//   module.exports = withNextIntl(nextConfig);
  