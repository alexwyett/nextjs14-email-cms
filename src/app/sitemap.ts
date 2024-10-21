import { S3 } from "@cagen/ezsite-components";
import { MetadataRoute } from "next";
import { BASE_URL } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = ((await S3.ListObjects()).Contents || []).filter(c => c.Key?.endsWith('.md'));

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