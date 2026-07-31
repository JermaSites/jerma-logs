export default defineCachedEventHandler(async (event) => {
  const { firebaseApiUrl, twitchUsername } = useRuntimeConfig(event).public

  try {
    const latestMessageQuery = {
      structuredQuery: {
        from: [
          {
            collectionId: 'messages',
          },
        ],
        where: {
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
        orderBy: [
          {
            field: {
              fieldPath: 'sentAt',
            },
            direction: 'DESCENDING',
          },
        ],
        limit: 1,
      },
    }

    const latestMessageData = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: latestMessageQuery,
    })

    return parseMessages(latestMessageData).at(0) ?? null
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch last message',
    })
  }
}, {
  maxAge: 60 * 60, // 1 hour
})
