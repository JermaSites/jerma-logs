export default defineCachedEventHandler(async (event) => {
  const { firebaseApiUrl, twitchUsername } = useRuntimeConfig(event).public

  const { year, month } = getRouterParams(event)

  if (!year || !month) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Year and month required',
    })
  }

  const bounds = monthBounds(year, month)

  if (!bounds) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid year or month',
    })
  }

  try {
    // https://firebase.google.com/docs/firestore/reference/rest/v1/StructuredQuery
    const messagesQuery = {
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
                  value: { stringValue: bounds.start },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'sentAt',
                  },
                  op: 'LESS_THAN_OR_EQUAL',
                  value: { stringValue: bounds.end },
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

    const messagesData = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: messagesQuery,
    })

    return parseMessages(messagesData)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages',
    })
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
})
