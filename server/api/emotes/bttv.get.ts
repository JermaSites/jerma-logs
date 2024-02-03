import type { UserBttvResponse, BttvEmote } from "@/types";

export default cachedEventHandler(
  async () => {
    const { twitchId } = useRuntimeConfig().public;

    const userPromise = $fetch<UserBttvResponse>(
      `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`
    );

    const globalEmotesPromise = $fetch<BttvEmote[]>(
      `https://api.betterttv.net/3/cached/emotes/global`
    );

    const [user, globalEmotes] = await Promise.all([
      userPromise,
      globalEmotesPromise,
    ]);

    return [...globalEmotes, ...user.channelEmotes, ...user.sharedEmotes];
  },
  {
    maxAge: 60 * 60 * 24,
  }
);
