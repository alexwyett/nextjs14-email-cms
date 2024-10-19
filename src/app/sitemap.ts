import { ListObjects } from "@/lib/s3";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = ((await ListObjects()).Contents || []).filter(c => c.Key?.endsWith('.md'));

  return [{
    url: 'https://norfolkbadminton.co.uk/',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  } as any].concat(
    files.map(f => ({
      url: `https://norfolkbadminton.co.uk/${f.Key!.replace('/index.md', '')}`,
      lastModified: f.LastModified || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  );
}