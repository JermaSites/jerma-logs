import type { RouteLocationNormalizedLoaded } from '#vue-router'

export type SortOrder = 'asc' | 'desc'

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
  badgeInfoRaw: string
  messageType: string
  emotes: string | null
  badgeInfo: {
    subscriber: string
  }
  id: string
  userType: string | null
  username: string
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
        mod: { [key: string]: any }
        subscriber: { [key: string]: any }
        badgesRaw: { [key: string]: any }
        color: { [key: string]: any }
        displayName: { [key: string]: any }
        turbo: { [key: string]: any }
        emotesRaw: { [key: string]: any }
        flags: { [key: string]: any }
        sentAt: { [key: string]: any }
        message: { [key: string]: any }
        userID: { [key: string]: any }
        roomID: { [key: string]: any }
        badges: { [key: string]: any }
        badgeInfoRaw: { [key: string]: any }
        messageType: { [key: string]: any }
        emotes: { [key: string]: any }
        badgeInfo: { [key: string]: any }
        id: { [key: string]: any }
        userType: { [key: string]: any }
        username: { [key: string]: any }
      }
      createTime: string
      updateTime: string
    }
    readTime: string
  },
]
