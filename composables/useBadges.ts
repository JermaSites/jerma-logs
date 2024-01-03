import type { Badge, BadgeInfo, BadgeMap } from "@/types";

const badges = reactive<BadgeMap>(new Map());

export function useBadges() {
  const fetchBadges = async (): Promise<void> => {
    const { data } = await useFetch<Badge[]>("/api/badges");

    data.value?.forEach((badge) => {
      const badgeVersionsMap = new Map(badge.versions.map((v) => [v.id, v]));
      badges.set(badge.set_id, badgeVersionsMap);
    });
  };

  function parseBadges(badgeInfo: BadgeInfo) {
    if (!badgeInfo) return [];

    const sortedKeys = (Object.keys(badgeInfo) as Array<keyof typeof badgeInfo>)
      .sort((a, b) => {
        let aValue: number;
        let bValue: number;
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
        prev[next] = badgeInfo[next];
        return prev;
      }, {} as BadgeInfo);

    return Object.entries(sortedKeys).map((badge) => {
      const badgeURL = badges?.get(badge[0])?.get(badge[1])?.image_url_1x;
      const name = badge[0];
      return { name: name, url: badgeURL };
    });
  }

  return { fetchBadges, parseBadges };
}
