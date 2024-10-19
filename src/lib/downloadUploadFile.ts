import { UploadFile } from "./s3";

export default async function downloadUploadFile(url: string, filename: string, Key: string) {
  const res = await fetch(url);
  if (res.ok) {
    const buff = await res.arrayBuffer();
    if (buff) {
      await UploadFile(
        `${Key}/${filename}`,
        buff
      );
  
      return filename;
    }
  }

  throw new Error('Error fetching file');
}