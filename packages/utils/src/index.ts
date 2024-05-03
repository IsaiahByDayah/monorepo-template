import { customAlphabet } from "nanoid"

export * as constants from "./constants"
export * as schemas from "./schemas"

// REF: https://github.com/CyberAP/nanoid-dictionary?tab=readme-ov-file#nolookalikessafe
const nanoid = customAlphabet("6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz", 22)

export const IdTypes = {
  USER: "user",
} as const
export type IIdType = (typeof IdTypes)[keyof typeof IdTypes]

export const IdPrefixes = {
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
