import { defineStore } from "pinia";

export const useSettings = defineStore("settings", {
  persist: true,
  state: () => {
    return {
      yearSort: "desc",
      monthSort: "desc",
      messageSort: "asc",
      latestSort: "desc",
      timestamps: true,
      notifications: false,
      susNotifications: false,
      testNotifications: false,
      fab: true,
      fcmToken: null,
      layout: {
        id: 1,
        componentName: "MessageListSimple",
        name: "Simple",
        description: "A simple list of all messages in a month, no seperation",
        crono: false,
      },
      layouts: [
        {
          id: 1,
          componentName: "MessageListSimple",
          name: "Simple",
          description:
            "A simple list of all messages in a month, no seperation",
          crono: false,
        },
        {
          id: 2,
          componentName: "MessageListSeperated",
          name: "Seperated",
          description:
            "Messages are seperated by day starting with the most recent message",
          crono: false,
        },
        {
          id: 3,
          componentName: "MessageListSeperated",
          name: "Seperated Chrono",
          description:
            "Messages are seperated by day and are sorted chronologically",
          crono: true,
        },
      ],
    };
  },
});
