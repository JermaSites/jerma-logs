import type { EmoteMap } from "@/types";
import linkifyHtml from "linkify-html";

const emoteMap = reactive<EmoteMap>(new Map());

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
        const emote = emoteMap.get(word);
        if (!emote) return word;

        const emoteName = emote.code;
        const imgSrc = emote.urls.at(0)?.url;
        return `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" width="28" height="28" alt="${emoteName}" title="${emoteName}" loading="lazy">`;
      })
      .join(" ");
  }

  return { fetchEmotes, parseEmotes };
}
