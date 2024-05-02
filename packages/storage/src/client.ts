import { S3Client } from "@aws-sdk/client-s3"

let _client: S3Client | undefined

export const getClient = () => {
  if (_client) {
    return _client
  }

  if (!process.env.B2_REGION) {
    throw new Error(
      "Could not create b2-storage client. B2_REGION env missing.",
    )
  }

  _client = new S3Client({
    endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
    region: process.env.B2_REGION,
  })

  return _client
}
