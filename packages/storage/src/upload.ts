import {
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { getClient } from "./client"

interface UploadRequest {
  storageKey: string
  contentLength?: number
  /**
   * Number of seconds before the generated url expores
   */
  ttl?: number
}
export const createUploadUrl = ({
  storageKey,
  contentLength,
  ttl,
}: UploadRequest) => {
  if (!process.env.B2_BUCKET) {
    throw new Error("Could not create presigned Url. B2_BUCKET env missing.")
  }

  const input: PutObjectCommandInput = {
    Bucket: process.env.B2_BUCKET,
    Key: storageKey,
    ContentLength: contentLength,
  }

  const client = getClient()
  const command = new PutObjectCommand(input)
  return getSignedUrl(client, command, { expiresIn: ttl })
}
