import type { FirestoreResponseObject } from 'firestore-rest-parser'
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

/** Badge set id -> version id, as sent by Twitch. Any set may be absent. */
export type BadgeInfo = Partial<Record<string, string>>

export interface ParsedBadge {
  name: string
  url: string
}

export interface BadgesResponse {
  data: {
    set_id: string
    versions: {
      id: string
      image_url_1x: string
      image_url_2x: string
      image_url_4x: string
      title: string
      description: string
      click_action: string | null
      click_url: string | null
    }[]
  }[]
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

/**
 * A {@link Message} whose `message`/`reply` have been rendered to HTML and whose
 * `badges` have been resolved to image URLs. Produced by `useParsedMessages`.
 */
export interface ParsedMessage extends Omit<Message, 'badges' | 'reply'> {
  badges: ParsedBadge[]
  reply: string
  unread?: boolean
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

export interface TwitchEmote {
  id: string
  name: string
  images: {
    url_1x: string
    url_2x: string
    url_4x: string
  }
  format: string[]
  scale: string[]
  theme_mode: string[]
}

export interface ChannelEmotesResponse {
  data: (TwitchEmote & {
    tier: string
    emote_type: 'bitstier' | 'follower' | 'subscriptions'
    emote_set_id: string
  })[]
  template: string
}

export interface GlobalEmotesResponse {
  data: TwitchEmote[]
  template: string
}

/**
 * `runQuery` always responds with at least one element. When nothing matched,
 * that element carries only a `readTime` — hence the optional `document`.
 */
export type MessagesResponse = {
  document?: FirestoreResponseObject
  readTime: string
}[]

export interface AccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

export interface StoredToken extends AccessToken {
  expires_at: number
}
