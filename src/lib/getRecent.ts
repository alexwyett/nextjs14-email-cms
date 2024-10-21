import { S3 } from "@cagen/ezsite-components";
import { S3_BASE_URL } from "@/constants";
import getPage, { SiteMKDown } from "./getPage";

export async function removeAttachment(page: `${string}/index.md`) {
  return await remove('attachments.json', page);
}

export async function removeRecent(page: `${string}/index.md`) {
  return await remove('recent.json', page);
}

export async function remove(filename: `${string}.json`, page: `${string}/index.md`) {
  const recent = await getJson(filename);

  await S3.UploadFile(
    filename,
    JSON.stringify(
      recent.filter(r => r.Key !== page)
    ),
    'application/json',
    'utf-8'
  );
}

export async function update(filename: `${string}.json`, pages: (`${string}/index.md`)[]) {
  const recent = await getJson(filename);

  await S3.UploadFile(
    filename,
    JSON.stringify(
      pages.map(p => ({ Key: p })).concat(recent)
    ),
    'application/json',
    'utf-8'
  );
}

export async function updateAttachments(pages: (`${string}/index.md`)[]) {
  return await update('attachments.json', pages);
}

export async function updateRecent(pages: (`${string}/index.md`)[]) {
  return await update('recent.json', pages);
}

export async function getJson(filename: `${string}.json`): Promise<{ Key: `${string}/index.md` }[]> {
  const res = await fetch(`${S3_BASE_URL}${filename}`, { next: { tags: [filename] } });
  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as { Key: `${string}/index.md` }[];

  return json.filter(
    r => r.Key
  );
}

export async function getPages(filename: `${string}.json`): Promise<SiteMKDown[]> {
  const json = await getJson(filename);
  
  const pages = await Promise.all(
    json.map(
      async r => {
        try {
          return await getPage(r.Key!.replaceAll('/index.md', ''))
        } catch (e: any) {
          console.log(e);
          return;
        }
      }
    ).filter(r => r)
  );

  return pages as SiteMKDown[];
}

export async function getRecentAttachments(): Promise<SiteMKDown[]> {
  return await getPages('attachments.json');
}

export default async function getRecent(): Promise<SiteMKDown[]> {
  return await getPages('recent.json');
}