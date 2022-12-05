import axios from "axios";

export function useBadges() {
  async function fetchBadges() {
    try {
      const globalBadgesPromise = axios.get(
        "https://badges.twitch.tv/v1/badges/global/display"
      );
      const channelBadgesPromise = axios.get(
        "https://badges.twitch.tv/v1/badges/channels/23936415/display"
      );
      const [globalBadges, channelBadges] = await Promise.all([
        globalBadgesPromise,
        channelBadgesPromise,
      ]);

      return {
        ...globalBadges.data.badge_sets,
        ...channelBadges.data.badge_sets,
      };
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
      const badgeURL = badgeList[badge[0]].versions[badge[1]].image_url_1x;
      return badgeURL;
    });
  }

  return { fetchBadges, parseBadges };
}
