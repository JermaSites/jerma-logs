/**
 * Render raw messages to display-ready HTML/badges, optionally sorted by
 * timestamp. Shared by the latest, month and search pages.
 */
export default function (
  messages: Ref<Message[]>,
  order?: Ref<SortOrder>,
): ComputedRef<ParsedMessage[]> {
  const { parseEmotes } = useEmotes()
  const { parseBadges } = useBadges()

  const parsedMessages = computed<ParsedMessage[]>(() => messages.value.map((msg) => {
    // Replies repeat the "@user" mention, which the reply block already shows.
    const rawMessage = msg.reply ? msg.message.replace(/^@\S+\s*/, '') : msg.message

    return {
      ...msg,
      message: parseEmotes(rawMessage),
      badges: parseBadges(msg.badges),
      reply: parseEmotes(msg.reply?.parent?.msgBody ?? ''),
    }
  }))

  if (!order)
    return parsedMessages

  return computed(() => parsedMessages.value.toSorted((a, b) => {
    const aTime = Number.parseInt(a.sentAt)
    const bTime = Number.parseInt(b.sentAt)

    return order.value === 'asc' ? aTime - bTime : bTime - aTime
  }))
}
