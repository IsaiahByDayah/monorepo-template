import { customAlphabet } from "nanoid"

import * as constants from "./constants"

export * as constants from "./constants"
export * as schemas from "./schemas"

interface GenerateStorageKeyOptionsBase {
  fileType: "image"
}

interface GenerateStorageKeyImageOptionsBase
  extends GenerateStorageKeyOptionsBase {
  imageTypeId: constants.api.IImageType
  imageId: string
  imageExtension: string
}

type GenerateStorageKeyOptions = GenerateStorageKeyImageOptionsBase

export const generateStorageKey = (
  options: GenerateStorageKeyOptions,
): string => {
  switch (options.fileType) {
    case "image":
      switch (options.imageTypeId) {
        case constants.api.ImageTypes.AVATAR:
          return `avatar/${options.imageId}.${options.imageExtension}`
        case constants.api.ImageTypes.PHOTO:
          return `photo/${options.imageId}.${options.imageExtension}`
        case constants.api.ImageTypes.LOGO:
          return `logo/${options.imageId}.${options.imageExtension}`
        case constants.api.ImageTypes.COVER:
          return `cover/${options.imageId}.${options.imageExtension}`
      }
  }
}

// REF: https://github.com/CyberAP/nanoid-dictionary?tab=readme-ov-file#nolookalikessafe
const nanoid = customAlphabet("6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz", 22)

export const IdTypes = {
  PHOTO: "photo",
  IMAGE: "image",
  USER: "user",
} as const
export type IIdType = (typeof IdTypes)[keyof typeof IdTypes]

export const IdPrefixes = {
  [IdTypes.PHOTO]: "pho",
  [IdTypes.IMAGE]: "img",
  [IdTypes.USER]: "usr",
} as const
export type IIdPrefix = (typeof IdPrefixes)[IIdType]

export const generateId = (type: IIdType): `${IIdPrefix}_${string}` => {
  const prefix = IdPrefixes[type]

  switch (type) {
    default:
      return `${prefix}_${nanoid(12)}`
  }
}

export const checkIfResourceExist = async (url: string) => {
  try {
    const res = await fetch(url, { method: "HEAD" })
    console.info("HEAD response:", res)
    return true
  } catch (err) {
    console.info("HEAD response error:", err)
    return false
  }
}
