export default defineCachedEventHandler(async (event) => {
  const { firebaseApiUrl } = useRuntimeConfig(event).public

  try {
    const queryData = {
      structuredQuery: {
        from: [
          {
            collectionId: 'sus',
          },
        ],
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

    const sus = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: queryData,
    })

    return parseMessages(sus).at(0) ?? null
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch SUS message',
    })
  }
}, {
  maxAge: 60 * 60, // 1 hour
})
