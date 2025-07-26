import type { RouteLocationNormalizedLoaded } from '#vue-router'

export type SortOrder = 'asc' | 'desc'

export interface AlgoliaIndex {
  message: string
}

export interface SortableCategories {
  year: SortOrder
  month: SortOrder
  message: SortOrder
  latest: SortOrder
}

export interface Emote {
  code: string
  urls: { size: string, url: string }[]
}

export type EmoteMap = Map<string, Emote>

export interface BadgeVersion {
  id: string
  image_url_1x: string
  image_url_2x: string
  image_url_4x: string
  title: string
  description: string
  click_action: string
  click_url: string
}

export interface Badge {
  set_id: string
  versions: BadgeVersion[]
}

export type BadgeMap = Map<string, Map<string, BadgeVersion>>

export interface BadgeInfo {
  subscriber: string
  moments: string
  broadcaster: string
}

export interface BadgesResponse {
  data: [
    {
      set_id: string
      versions: [
        {
          id: string
          image_url_1x: string
          image_url_2x: string
          image_url_4x: string
          title: string
          description: string
          click_action: string | null
          click_url: string | null
        },
      ]
    },
  ]
}

export interface Message {
  mod: boolean
  subscriber: boolean
  badgesRaw: string
  color: string
  displayName: string
  turbo: boolean
  emotesRaw: string | null
  flags: string | null
  sentAt: string
  message: string
  userID: string
  roomID: string
  badges: BadgeInfo
  badgesArray?: {
    name: string
    url: string
  }[]
  badgeInfoRaw: string
  messageType: string
  emotes: string | null
  badgeInfo: {
    subscriber: string
  }
  id: string
  userType: string | null
  username: string
  reply?: {
    parent: {
      displayName: string
      msgBody: string
      msgID: string
      userID: string
      userLogin: string
    }
    threadParent: {
      displayName: string
      msgID: string
      userID: string
      userLogin: string
    }
  }
}

export interface Breadcrumb {
  label: string
  to?: { name: string, params?: { year: string } }
}

export type BreadcrumbFunction = (
  route: RouteLocationNormalizedLoaded,
) => Breadcrumb[]

export interface BttvEmote {
  id: string
  code: string
  imageType: 'png' | 'webp' | 'gif'
  animated: boolean
  userId: string
}

export interface UserBttvResponse {
  id: string
  bots: string[]
  avatar: string
  channelEmotes: BttvEmote[]
  sharedEmotes: BttvEmote[]
}

export interface ChannelEmotesResponse {
  data: [
    {
      id: string
      name: string
      images: {
        url_1x: string
        url_2x: string
        url_4x: string
      }
      tier: string
      emote_type: 'bitstier' | 'follower' | 'subscriptions'
      emote_set_id: string
      format: ['animated' | 'static']
      scale: ['1.0' | '2.0' | '3.0']
      theme_mode: ['light' | 'dark']
    },
  ]
  template: string
}

export interface GlobalEmotesResponse {
  data: [
    {
      id: string
      name: string
      images: {
        url_1x: string
        url_2x: string
        url_4x: string
      }
      format: string[]
      scale: ['1.0', '2.0', '3.0']
      theme_mode: ['light', 'dark']
    },
  ]
  template: string
}

export type MessagesResponse = [
  {
    document: {
      name: string
      fields: {
        mod: { [key: string]: boolean }
        subscriber: { [key: string]: boolean }
        badgesRaw: { [key: string]: string }
        color: { [key: string]: string }
        displayName: { [key: string]: string }
        turbo: { [key: string]: boolean }
        emotesRaw: { [key: string]: string | null }
        flags: { [key: string]: string | null }
        sentAt: { [key: string]: string }
        message: { [key: string]: string }
        userID: { [key: string]: string }
        roomID: { [key: string]: string }
        badges: { [key: string]: any }
        badgeInfoRaw: { [key: string]: string }
        messageType: { [key: string]: string }
        emotes: { [key: string]: string[] }
        badgeInfo: { [key: string]: string }
        id: { [key: string]: string }
        userType: { [key: string]: string | null }
        username: { [key: string]: string }
      }
      createTime: string
      updateTime: string
    }
    readTime: string
  },
]

export interface AccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

export interface StoredToken extends AccessToken {
  expires_at: number
}
