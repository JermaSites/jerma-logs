import type { EmoteMap } from "@/types";
import linkifyHtml from "linkify-html";

const emoteMap = reactive<EmoteMap>(new Map());

export function useEmotes() {
  const fetchEmotes = async (): Promise<EmoteMap> => {
    const { data: emotes } = await useFetch("/api/emotes");

    emotes.value?.forEach((emote) => {
      emoteMap.set(emote.code, emote);
    });

    return emoteMap;
  };

  function parseEmotes(msg: string): string {
    return linkifyHtml(msg)
      .split(" ")
      .map((word) => {
        if (!emoteMap.has(word)) return word;

        const emote = emoteMap.get(word);
        const emoteName = emote?.code;
        const imgSrc = emote?.urls[0].url;
        const imgEl = `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" width="28" height="28" alt="${emoteName}" title="${emoteName}" loading="lazy">`;
        return imgEl;
      })
      .join(" ");
  }

  return { fetchEmotes, parseEmotes };
}
