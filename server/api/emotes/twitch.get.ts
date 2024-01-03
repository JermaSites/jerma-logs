import twitchApi from "../../utils/twitch";
import type { ChannelEmotesResponse, GlobalEmotesResponse } from "@/types";

export default cachedEventHandler(
  async (event) => {
    const { twitchId } = useRuntimeConfig().public;

    const channelEmotesPromise = twitchApi<ChannelEmotesResponse>(
      `chat/emotes?broadcaster_id=${twitchId}`,
    );

    const globalEmotesPromise =
      twitchApi<GlobalEmotesResponse>("chat/emotes/global");

    const [globalEmotes, channelEmotes] = await Promise.all([
      globalEmotesPromise,
      channelEmotesPromise,
    ]);

    const emotes = [...globalEmotes.data, ...channelEmotes.data];

    return emotes;
  },
  { maxAge: 60 * 60 * 24 },
);
