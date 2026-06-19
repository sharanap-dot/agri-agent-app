import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agri-agent-app.vercel.app";

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/dashboard`, lastModified: new Date() },
    { url: `${base}/farmers`, lastModified: new Date() },
    { url: `${base}/buyers`, lastModified: new Date() },
    { url: `${base}/transactions`, lastModified: new Date() },
    { url: `${base}/inventory`, lastModified: new Date() },
    { url: `${base}/reports`, lastModified: new Date() },
    { url: `${base}/company`, lastModified: new Date() },
  ];
}