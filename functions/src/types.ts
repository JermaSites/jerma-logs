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
