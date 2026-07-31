import { parse } from 'firestore-rest-parser'

/**
 * Turn a Firestore `runQuery` response into messages.
 *
 * The response always contains at least one element; when nothing matched, that
 * element carries no `document`, so it has to be dropped rather than parsed.
 */
export default function (response: MessagesResponse): Message[] {
  return response.flatMap((item) => {
    const message = parse<Message>(item.document)
    return message ? [message] : []
  })
}
