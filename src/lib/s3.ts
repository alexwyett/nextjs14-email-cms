import { S3_BASE_URL } from "@/constants";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { basename } from "path";

export function Client() {
  return new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!
    }
  });
}

export type PageFile = {
  type?: string;
  size?: number;
  encoding?: string;
  Key: string;
  filename: string;
  last_modified?: Date;
  url: string;
}

export async function GetObject(Key: string): Promise<PageFile> {
  const client = Client();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: Key
    })
  );

  if (response.Body) {
    return {
      type: response.ContentType,
      size: response.ContentLength,
      encoding: response.ContentEncoding,
      Key,
      filename: basename(Key),
      last_modified: response.LastModified,
      url: `${S3_BASE_URL}${Key}`
    }
  }

  throw new Error(`${Key}: not found`);
}

export async function ListObjects(prefix?: string) {
  const client = Client();
  const response = await client.send(
    new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: prefix || '',
      MaxKeys: 1000
    })
  );

  return response;
}

export async function DeleteFile(filename: string) {
  const client = Client();
  const response = await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename
    })
  );

  return response;
}

export async function UploadFile(filename: string, data: any, contentType?: any, contentEncoding?: any) {
  const client = Client();
  const response = await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: data,
      ContentType: contentType,
      ContentEncoding: contentEncoding
    })
  );

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error('Error saving file');
  }

  return response;
}