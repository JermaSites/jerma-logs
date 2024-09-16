import type { MessagesResponse } from '@/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import { parse } from 'firestore-rest-parser'
import { useCapitalize } from '~/composables/useCapitalize.js'

dayjs.extend(utc)

const { capitalize } = useCapitalize()
const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineEventHandler(
  async (event) => {
    const { year, month } = getRouterParams(event)
    const date = dayjs(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
    const startTime = date.startOf('month').valueOf().toString()
    const endTime = date.endOf('month').valueOf().toString()

    const queryData = {
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
                  value: { stringValue: startTime },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'sentAt',
                  },
                  op: 'LESS_THAN_OR_EQUAL',
                  value: { stringValue: endTime },
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
            direction: 'DESCENDING',
          },
        ],
      },
    }

    const messagesQuery = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: queryData,
    })

    if (messagesQuery.length <= 1)
      return []

    const messages = messagesQuery.map((doc) => {
      return parse(doc.document)
    })

    return messages
  },
)

// export default defineCachedEventHandler(
//   async (event) => {
//     const { year, month } = getRouterParams(event)
//     const date = dayjs(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
//     const startTime = date.startOf('month').valueOf().toString()
//     const endTime = date.endOf('month').valueOf().toString()

//     const queryData = {
//       structuredQuery: {
//         from: [
//           {
//             collectionId: 'messages',
//           },
//         ],
//         where: {
//           compositeFilter: {
//             op: 'AND',
//             filters: [
//               {
//                 fieldFilter: {
//                   field: {
//                     fieldPath: 'username',
//                   },
//                   op: 'EQUAL',
//                   value: {
//                     stringValue: twitchUsername,
//                   },
//                 },
//               },
//               {
//                 fieldFilter: {
//                   field: {
//                     fieldPath: 'sentAt',
//                   },
//                   op: 'GREATER_THAN_OR_EQUAL',
//                   value: { stringValue: startTime },
//                 },
//               },
//               {
//                 fieldFilter: {
//                   field: {
//                     fieldPath: 'sentAt',
//                   },
//                   op: 'LESS_THAN_OR_EQUAL',
//                   value: { stringValue: endTime },
//                 },
//               },
//             ],
//           },
//         },
//         orderBy: [
//           {
//             field: {
//               fieldPath: 'sentAt',
//             },
//             direction: 'DESCENDING',
//           },
//         ],
//       },
//     }

//     console.log('before fetch')

//     const messagesQuery = await $fetch<MessagesResponse>(firebaseApiUrl, {
//       method: 'POST',
//       body: queryData,
//     })

//     console.log('after fetch')

//     if (messagesQuery.length <= 1)
//       return []

//     const messages = messagesQuery.map((doc) => {
//       return parse(doc.document)
//     })

//     console.log(messages)

//     return messages
//   },
//   {
//     maxAge: 0, // 60 * 60 * 24,
//     shouldInvalidateCache(event) {
//       const { year, month } = getRouterParams(event)
//       const date = dayjs.utc(`${year}-${month}`, 'YYYY-MMMM')

//       const endTime = date.endOf('month').valueOf()
//       const currentDate = dayjs.utc().valueOf()

//       console.log(endTime > currentDate)

//       return endTime > currentDate
//     },
//   },
// )
