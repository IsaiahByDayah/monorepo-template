export const buildObjectS3Url = (storageKey: string) => {
  if (!process.env.B2_REGION) {
    throw new Error(
      "Could not create presignedUrl client. B2_BUCKET env missing.",
    )
  }

  if (!process.env.B2_BUCKET) {
    throw new Error(
      "Could not create presignedUrl client. B2_BUCKET env missing.",
    )
  }

  return `https://${process.env.B2_BUCKET}.s3.${process.env.B2_REGION}.backblazeb2.com/${storageKey}`
}
