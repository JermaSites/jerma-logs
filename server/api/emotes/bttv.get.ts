import type { UserBttvResponse, BttvEmote } from "@/types";

export default cachedEventHandler(
  async () => {
    const { twitchId } = useRuntimeConfig().public;

    const user = await $fetch<UserBttvResponse>(
      `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`
    );

    const globalEmotes = await $fetch<BttvEmote[]>(
      `https://api.betterttv.net/3/cached/emotes/global`
    );

    return globalEmotes.concat(user.channelEmotes, user.sharedEmotes);
  },
  {
    maxAge: 60 * 60 * 24,
  }
);
