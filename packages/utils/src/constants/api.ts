export const Visibilities = {
  PUBLIC: 1,
  UNLISTED: 2,
} as const

export const Likelihoods = {
  UNKNOWN: 1,
  VERY_UNLIKELY: 2,
  UNLIKELY: 3,
  POSSIBLE: 4,
  LIKELY: 5,
  VERY_LIKELY: 6,
} as const
export type ILikelihood = (typeof Likelihoods)[keyof typeof Likelihoods]

export const StorageSources = {
  BACKBLAZE_B2: 1,
  GOOGLE_CLOUD_STROAGE: 2,
} as const

export const GameCompanyRelationships = {
  DEVELOPER: 1,
  PUBLISHER: 2,
} as const

export const TagTypes = {
  GENERIC: 1,
  PHOTOGRAPHY: 2,
} as const

export const Licenses = {
  ALL_RIGHTS_RESERVED: 1,
  ATTRIBUTION_NONCOMMERCIAL__4_0: 2,
  ATTRIBUTION_NONCOMMERCIAL_NODERIVATIVES__4_0: 3,
  ATTRIBUTION_NONCOMMERCIAL_SHAREALIKE__4_0: 4,
} as const

export const SocialPlatforms = {
  DISCORD: 1,
  DRIBBBLE: 2,
  EPIC_GAMES: 3,
  FACEBOOK: 4,
  FLICKR: 5,
  GG: 6,
  GOG: 7,
  INSTAGRAM: 8,
  LINKEDIN: 9,
  NINTENDO__NETWORK_ID: 10,
  PINTEREST: 11,
  PLAYSTATION_NETWORK: 12,
  SHUTTERSTOCK: 13,
  SLACK: 14,
  SMUGMUG: 15,
  STEAM: 16,
  TIKTOK: 17,
  TUMBLR: 18,
  TWITCH: 19,
  X__TWITTER: 20,
  UNSPLASH: 21,
  VIMEO: 22,
  XBOX_LIVE: 23,
  YOUTUBE: 24,
  THREADS: 25,
  BLUESKY: 26,
  MASTODON: 27,
  NINTENDO__FRIEND_CODE: 28,
} as const

export const SupportPlatforms = {
  BUY_ME_A_COFFEE: 1,
  KO_FI: 2,
  PATREON: 3,
  PAYPAL: 4,
} as const

export const PhotoStatuses = {
  PUBLISHED: 1,
  REVIEWED_AND_PUBLISHED: 2,
  PENDING: 3,
  UNDER_REVIEW: 4,
  INELIGIBLE: 5,
  REVIEWED_AND_INELIGIBLE: 6,
} as const

export const ImageTypes = {
  PHOTO: 1,
  AVATAR: 2,
  LOGO: 3,
  COVER: 4,
} as const
export type IImageType = (typeof ImageTypes)[keyof typeof ImageTypes]

export const ImageStatuses = {
  APPROVED: 1,
  REVIEWED_AND_APPROVED: 2,
  PENDING_UPLOAD: 3,
  UNDER_REVIEW: 4,
  REJECTED: 5,
  REVIEWED_AND_REJECTED: 6,
} as const
