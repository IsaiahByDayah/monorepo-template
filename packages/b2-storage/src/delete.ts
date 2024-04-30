import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { getClient } from "./client"

interface DeleteRequest {
  storageKey: string
}
export const deleteFile = ({ storageKey }: DeleteRequest) => {
  if (!process.env.B2_BUCKET) {
    throw new Error(
      "Could not create presignedUrl client. B2_BUCKET env missing.",
    )
  }

  const client = getClient()
  const command = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: storageKey,
  })
  return client.send(command)
}
