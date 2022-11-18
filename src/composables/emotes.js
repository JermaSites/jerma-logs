import { reactive } from "vue";
import axios from "axios";
import linkifyStr from "linkify-string";

export async function useEmotes() {
  // TODO: Get Twitch Emotes from API
  // async function fetchTwitchEmotes() {
  //   const globalEmotesPromise = axios.get(
  //     "https://api.twitch.tv/helix/chat/emotes/global"
  //   );
  //   const channelEmotesPromise = axios.get(
  //     "https://api.twitch.tv/helix/chat/emotes?broadcaster_id=23936415"
  //   );

  //   const [globalEmotes, channelEmotes] = await Promise.all([
  //     globalEmotesPromise,
  //     channelEmotesPromise,
  //   ]);

  //   return [...globalEmotes.data, ...channelEmotes.data.sharedEmotes];
  // }

  // const twitchEmoteMap = new Map();

  // try {
  //   const twitchEmotes = reactive(await fetchTwitchEmotes());

  //   twitchEmotes.forEach((emote) => {
  //     twitchEmoteMap.set(emote.code, emote);
  //   });
  // } catch (error) {
  //   console.error(error.message);
  // }

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

  const bttvEmoteMap = new Map();
  try {
    const bttvEmotes = reactive(await fetchBetterTTVEmotes());

    bttvEmotes.forEach((emote) => {
      bttvEmoteMap.set(emote.code, emote);
    });
  } catch (error) {
    console.error(error.message);
  }

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
        const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" alt="${emoteName}" title="${emoteName}">`;
        // const escapedEmote = emoteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // const regEx = new RegExp(`(^|\\s)(${escapedEmote})($|\\s)`, "g");

        // text = text.replaceAll(regEx, `$1${imgEl}$3`);
        text = text
          .split(" ")
          .map((word) => {
            if (word === emoteName) {
              return imgEl;
            }

            return word;
          })
          .join(" ");
      }
    }

    const bttvEmotesUrl = "//cdn.betterttv.net/emote/{{id}}/1x";

    text = text
      .split(" ")
      .map((word) => {
        if (bttvEmoteMap.has(word)) {
          const emote = bttvEmoteMap.get(word);
          const imgSrc = bttvEmotesUrl.replace("{{id}}", emote.id);
          const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" alt="${emote.code}" title="${emote.code}">`;
          return imgEl;
        }

        return word;
      })
      .join(" ");

    // bttvEmotes.forEach((emote) => {
    //   const imgSrc = bttvEmotesUrl.replace("{{id}}", emote.id);
    //   const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" alt="${emote.code}" title="${emote.code}">`;
    //   const escapedEmote = emote.code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    //   const regEx = new RegExp(`(^|\\s)(${escapedEmote})($|\\s)`, "g");
    //   text = text.replaceAll(regEx, `$1${imgEl}$3`);
    // });

    return text;
  };

  return { parseMessage };
}
