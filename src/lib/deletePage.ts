import { DeleteFile, ListObjects } from "./s3";

export default async function deletePage(slug: string): Promise<undefined> {
  const obj = await ListObjects(slug);

  if (obj.Contents) {
    await Promise.all(
      obj.Contents.filter(
        c => c.Key
      ).map(
        async c => await DeleteFile(c.Key!)
      )
    )
  }
}