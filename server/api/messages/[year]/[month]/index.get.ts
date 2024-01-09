import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { parse } from "firestore-rest-parser";
import type { MessagesResponse } from "@/types";

dayjs.extend(utc);

export default cachedEventHandler(
  async (event) => {
    const { twitchUsername } = useRuntimeConfig().public;
    const { year, month } = getRouterParams(event);
    const date = dayjs.utc(`${year}-${month}-01`, "YYYY-MMMM-DD");
    const startTime = date.startOf("month").valueOf().toString();
    const endTime = date.endOf("month").valueOf().toString();

    const url = `https://firestore.googleapis.com/v1beta1/projects/jerma-logs/databases/(default)/documents:runQuery`;
    const messagesQuery = await $fetch<MessagesResponse>(url, {
      method: "POST",
      body: {
        structuredQuery: {
          from: [
            {
              collectionId: "messages",
            },
          ],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                {
                  fieldFilter: {
                    field: {
                      fieldPath: "username",
                    },
                    op: "EQUAL",
                    value: {
                      stringValue: twitchUsername,
                    },
                  },
                },
                {
                  fieldFilter: {
                    field: {
                      fieldPath: "sentAt",
                    },
                    op: "LESS_THAN_OR_EQUAL",
                    value: { stringValue: endTime },
                  },
                },
                {
                  fieldFilter: {
                    field: {
                      fieldPath: "sentAt",
                    },
                    op: "GREATER_THAN_OR_EQUAL",
                    value: { stringValue: startTime },
                  },
                },
              ],
            },
          },
          orderBy: [
            {
              field: {
                fieldPath: "sentAt",
              },
              direction: "DESCENDING",
            },
          ],
        },
      },
    });

    if (messagesQuery.length <= 1) return [];

    const messages = messagesQuery.map((doc) => {
      return parse(doc.document);
    });

    return messages;
  },
  {
    maxAge: 60 * 60 * 24,
    shouldInvalidateCache(event) {
      const { year, month } = getRouterParams(event);
      const date = dayjs.utc(`${year}-${month}`, "YYYY-MMMM");

      const endTime = date.endOf("month").valueOf();
      const currentDate = dayjs.utc().valueOf();

      return endTime > currentDate;
    },
  }
);
