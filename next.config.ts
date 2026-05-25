import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ornekler",
        destination: "/#kitaptan",
        permanent: true,
      },
      {
        source: "/sss",
        destination: "/kitap",
        permanent: true,
      },
      {
        source: "/satin-al",
        destination:
          process.env.NEXT_PUBLIC_BOOK_PURCHASE_URL?.trim() || "/#bagis",
        permanent: false,
      },
      {
        source: "/indir",
        destination: "/#indir",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
