import { useTwitchAPI } from "./twitch-api";
const twitchApi = useTwitchAPI();

export function useBadges() {
  async function fetchBadges() {
    try {
      const globalBadgesPromise = twitchApi.get("chat/badges/global");
      const channelBadgesPromise = twitchApi.get(
        "chat/badges?broadcaster_id=23936415"
      );
      const [globalBadges, channelBadges] = await Promise.all([
        globalBadgesPromise,
        channelBadgesPromise,
      ]);

      const badges = [...globalBadges.data.data, ...channelBadges.data.data];

      const badgesMap = new Map(
        badges.map((badge) => [
          badge.set_id,
          new Map(badge.versions.map((v) => [v.id, v])),
        ])
      );

      return badgesMap;
    } catch (error) {
      console.error(error);
    }
  }

  function parseBadges(badges, badgeList) {
    if (!badges) return [];

    const sortedKeys = Object.keys(badges)
      .sort((a, b) => {
        let aValue;
        let bValue;
        switch (a) {
          case "broadcaster":
            aValue = 0;
            break;
          case "subscriber":
            aValue = 1;
            break;
          default:
            aValue = 2;
            break;
        }
        switch (b) {
          case "broadcaster":
            bValue = 0;
            break;
          case "subscriber":
            bValue = 1;
            break;
          default:
            bValue = 2;
            break;
        }
        return aValue - bValue;
      })
      .reduce((prev, next) => {
        prev[next] = badges[next];
        return prev;
      }, {});

    return Object.entries(sortedKeys).map((badge) => {
      const badgeURL = badgeList.get(badge[0]).get(badge[1]).image_url_1x;
      const name = badge[0];
      return { name: name, url: badgeURL };
    });
  }

  return { fetchBadges, parseBadges };
}
