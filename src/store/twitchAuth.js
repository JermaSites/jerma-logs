import { defineStore } from "pinia";

export const useTwitchAuth = defineStore("twitchAuth", {
    persist: true,
    state: () => {
        return {
            token: null
        };
    },
});
