
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadToS3(base64Image: string, folder: string = 'uploads'): Promise<string> {
  // 1. Check if it's already a URL (e.g. if we are editing and it's already on S3)
  if (base64Image.startsWith('http')) return base64Image;

  // 2. Convert Base64 to Buffer
  const match = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);

  if (!match) {
    // If no prefix, try assuming it's raw base64 jpeg? Or throw.
    // Let's assume generic jpeg if missing prefix but looks like base64
    // But safely, let's just log and throw or return null
    console.error('Invalid image format for S3 upload');
    throw new Error('Invalid image format');
  }

  const extension = match[1]; // jpeg, png, etc
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // 3. Generate Unique Filename
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

  // 4. Upload
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME || 'picksyuploads',
    Key: fileName,
    Body: buffer,
    ContentType: `image/${extension}`,
    // ACL: 'public-read', // Not recommended if Block Public Access is on. User unchecked it so this might work, 
    // but better to rely on Bucket Policy. If strict ACLs are enforced, this line causes error.
    // We will omit ACL and rely on the bucket being public.
  });

  await s3Client.send(command);

  // 5. Return Public URL
  const region = process.env.AWS_REGION || 'ap-southeast-2';
  const bucket = process.env.AWS_BUCKET_NAME || 'picksyuploads';

  return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
}
