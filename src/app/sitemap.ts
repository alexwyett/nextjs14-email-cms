import { MetadataRoute } from "next";
import { BASE_URL } from "@/constants";
import { ListObjects } from "@/lib/s3";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = ((await ListObjects()).Contents || []).filter(c => c.Key?.endsWith('.md'));

  return [{
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  } as any].concat(
    files.map(f => ({
      url: `${BASE_URL}${f.Key!.replace('/index.md', '')}`,
      lastModified: f.LastModified || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  );
}