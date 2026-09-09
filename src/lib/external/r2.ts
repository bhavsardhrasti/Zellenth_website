import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { server, client } from '@/lib/env';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${server.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: server.R2_ACCESS_KEY_ID,
    secretAccessKey: server.R2_SECRET_ACCESS_KEY,
  },
});

export function getPublicUrl(key: string): string {
  return `${client.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}

export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: server.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return getPublicUrl(key);
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: server.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: server.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2Client, command, { expiresIn: 3600 });
}
