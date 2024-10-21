import { S3 } from "@cagen/ezsite-components";

export default async function deletePage(slug: string): Promise<undefined> {
  const obj = await S3.ListObjects(slug);

  if (obj.Contents) {
    await Promise.all(
      obj.Contents.filter(
        c => c.Key
      ).map(
        async c => await S3.DeleteFile(c.Key!)
      )
    )
  }
}