export default defineCachedEventHandler(async (event) => {
  const { firebaseApiUrl, twitchUsername } = useRuntimeConfig(event).public

  try {
    // Reuses the sibling endpoint's cache entry rather than repeating the query.
    const latestMessage = await $fetch<Message | null>('/api/messages/latest/lastMessage')

    if (!latestMessage)
      return []

    const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(latestMessage.sentAt))

    const latestMessagesQuery = {
      structuredQuery: {
        from: [
          {
            collectionId: 'messages',
          },
        ],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: [
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'username',
                  },
                  op: 'EQUAL',
                  value: {
                    stringValue: twitchUsername,
                  },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'sentAt',
                  },
                  op: 'GREATER_THAN_OR_EQUAL',
                  value: { stringValue: dayOfLatestMessage },
                },
              },
            ],
          },
        },
        orderBy: [
          {
            field: {
              fieldPath: 'sentAt',
            },
            direction: 'ASCENDING',
          },
        ],
      },
    }

    const latestMessagesData = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: latestMessagesQuery,
    })

    return parseMessages(latestMessagesData)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch latest messages',
    })
  }
}, {
  maxAge: 60 * 60, // 1 hour
})
