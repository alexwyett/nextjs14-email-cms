
import { FrontMatterData, matter } from 'md-front-matter';
import { S3 } from '@cagen/ezsite-components';
import { S3_BASE_URL } from "@/constants";
import getExcerpt from './getExcerpt';

export type SiteMKDown = {
  data: FrontMatterData & {
    description?: string;
    created: Date;
    thumbnail?: string;
    title: string;
    Key?: string;
    attachments?: string;
  },
  raw: string;
  content: string;
  excerpt: string;
  href: string;
  files: S3.PageFile[];
}

export default async function getPage(slug: string|string[]): Promise<SiteMKDown> {
  const fullSlug = typeof slug === 'string' ? slug : slug.join('/');
  const url = `${S3_BASE_URL}${fullSlug}/index.md`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Page: ${fullSlug} not found`)
  }

  const mkdown = await res.text();

  const page = matter(mkdown) as SiteMKDown;

  const excerpt = getExcerpt(page.content);

  page.excerpt = excerpt.length === 150 ? `${excerpt.slice(0, 147)}...` : excerpt;
  page.href = fullSlug;
  page.raw = mkdown;
  page.files = [];

  if (page?.data?.attachments) {
    const files = await S3.ListObjects(fullSlug);
    if (files.Contents) {
      page.files = await Promise.all(
        files.Contents.filter(
          c => c.Key && !c.Key?.includes('index.md') && !c.Key?.toLowerCase().endsWith('.png') && !c.Key?.toLowerCase().endsWith('.jpg') && !c.Key?.toLowerCase().endsWith('.webp')
        ).map(async c => await S3.GetObject(c.Key!))
      );
    }

    page?.data?.attachments.split(',').map(at => {
      page.content = page.content.replaceAll(`[image: ${at}]`, `![${at}](${S3_BASE_URL}${fullSlug}/${at})`)
    })
  }

  return page;
}