import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const sharedRules = {
  allow: "/",
  disallow: ["/oku", "/api/"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...sharedRules },
      { userAgent: "GPTBot", ...sharedRules },
      { userAgent: "Google-Extended", ...sharedRules },
      { userAgent: "anthropic-ai", ...sharedRules },
      { userAgent: "ClaudeBot", ...sharedRules },
      { userAgent: "PerplexityBot", ...sharedRules },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
