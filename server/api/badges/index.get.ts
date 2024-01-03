import twitchApi from "../../utils/twitch";

type BadgesResponse = {
  data: [
    {
      set_id: string;
      versions: [
        {
          id: string;
          image_url_1x: string;
          image_url_2x: string;
          image_url_4x: string;
          title: string;
          description: string;
          click_action: string | null;
          click_url: string | null;
        },
      ];
    },
  ];
};

export default cachedEventHandler(
  async (event) => {
    const globalBadgesPromise = twitchApi<BadgesResponse>("chat/badges/global");

    const channelBadgesPromise = twitchApi<BadgesResponse>(
      "chat/badges?broadcaster_id=23936415",
    );

    const [globalBadges, channelBadges] = await Promise.all([
      globalBadgesPromise,
      channelBadgesPromise,
    ]);

    const badges = [...globalBadges.data, ...channelBadges.data];

    return badges;
  },
  {
    maxAge: 60 * 60 * 24,
  },
);
