import axios from "axios";
import linkifyStr from "linkify-string";

async function fetchEmotes() {
  const globalEmotesPromise = axios.get(
    "https://emotes.adamcy.pl/v1/global/emotes/twitch.7tv.bttv.ffz"
  );
  const channelEmotesPromise = axios.get(
    "https://emotes.adamcy.pl/v1/channel/23936415/emotes/twitch.7tv.bttv.ffz"
  );

  const [globalEmotes, channelEmotes] = await Promise.all([
    globalEmotesPromise,
    channelEmotesPromise,
  ]);

  const emotes = [...globalEmotes.data, ...channelEmotes.data];

  const emoteMap = new Map();

  emotes.forEach((emote) => {
    emoteMap.set(emote.code, emote);
  });

  return emoteMap;
}

let emoteMap;

export async function useEmotes() {
  if (!emoteMap) {
    emoteMap = await fetchEmotes()
  }

  const parseMessage = (message) => {
    return parseEmotes(parseLinks(message));
  };

  const parseLinks = (message) => {
    return linkifyStr(message);
  };

  const parseEmotes = (message) => {
    return message
      .split(" ")
      .map((word) => {
        if (emoteMap.has(word)) {
          const emote = emoteMap.get(word);
          const emoteName = emote.code;
          const imgSrc = emote.urls[0].url;
          const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" width="28" height="28" alt="${emoteName}" title="${emoteName}">`;
          return imgEl;
        }

        return word;
      })
      .join(" ");
  };

  return { parseMessage };
}
