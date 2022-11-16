import { reactive } from "vue";
import axios from "axios";
import linkifyStr from "linkify-string";

export async function useEmotes() {
  async function fetchBetterTTVEmotes() {
    const globalEmotesPromise = axios.get(
      "https://api.betterttv.net/3/cached/emotes/global"
    );
    const channelEmotesPromise = axios.get(
      "https://api.betterttv.net/3/cached/users/twitch/23936415"
    );

    const [globalEmotes, channelEmotes] = await Promise.all([
      globalEmotesPromise,
      channelEmotesPromise,
    ]);

    return [...globalEmotes.data, ...channelEmotes.data.sharedEmotes];
  }

  const bttvEmotes = reactive(await fetchBetterTTVEmotes());

  const parseMessage = (messageObj) => {
    return parseEmotes(parseLinks(messageObj.message), messageObj);
  };

  const parseLinks = (text) => {
    return linkifyStr(text);
  };

  const parseEmotes = (text, messageObj) => {
    const twitchEmotesUrl = "https://static-cdn.jtvnw.net/emoticons/v1";
    if (messageObj.emotes) {
      for (const [emoteId, emoteLocations] of Object.entries(
        messageObj.emotes
      )) {
        const start = emoteLocations[0].split("-")[0];
        const end = emoteLocations[0].split("-")[1];
        const emoteName = messageObj.message.substring(+start, +end + 1);
        const imgSrc = `${twitchEmotesUrl}/${emoteId}/1.0`;
        const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" alt="${emoteName}">`;
        const escapedEmote = emoteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regEx = new RegExp(`(^|\\s)(${escapedEmote})($|\\s)`, "g");

        text = text.replaceAll(regEx, `$1${imgEl}$3`);
      }
    }

    const bttvEmotesUrl = "//cdn.betterttv.net/emote/{{id}}/1x";

    bttvEmotes.forEach((emote) => {
      const imgSrc = bttvEmotesUrl.replace("{{id}}", emote.id);
      const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" alt="${emote.code}">`;
      const escapedEmote = emote.code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regEx = new RegExp(`(^|\\s)(${escapedEmote})($|\\s)`, "g");
      text = text.replaceAll(regEx, `$1${imgEl}$3`);
    });

    return text;
  };

  return { parseMessage };
}
