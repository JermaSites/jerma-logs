<script setup lang="ts">
import type { Messaging } from "firebase/messaging";
import { httpsCallable } from "firebase/functions";
import {
  getMessaging,
  onMessage,
  isSupported,
  getToken,
} from "firebase/messaging";
import { XCircleIcon } from "@heroicons/vue/24/solid";

const { app, functions } = useFirebase();

const settingsStore = useSettingsStore();
const {
  messageNotifications,
  susNotifications,
  testNotifications,
  colorModeValue,
  hideMessageTimestamps,
} = storeToRefs(settingsStore);

const messaging = ref<Messaging>();

onMounted(async () => {
  const messageSupport = await isSupported();
  if (!messageSupport) return;

  messaging.value = getMessaging(app);

  onMessage(messaging.value, (payload) => {
    console.log("Message received. ", payload);
  });
});

const subscribeToTopic = httpsCallable(functions, "subscribeToTopic");

const unsubscribeFromTopic = httpsCallable(functions, "unsubscribeFromTopic");

const notificationPermission = usePermission("notifications");

const colorMode = useColorMode();

const lightModeEnabled = computed({
  get() {
    return colorMode.value === "light";
  },
  set(enableLightMode) {
    enableLightMode
      ? (colorMode.preference = "light")
      : (colorMode.preference = "dark");
  },
});

// set the color mode on client only
watchEffect(() => {
  if (colorMode.value !== "system") {
    colorModeValue.value = colorMode.value;
  }
});

watchEffect(() => {
  if (
    notificationPermission.value &&
    notificationPermission.value !== "granted"
  ) {
    messageNotifications.value = false;
    susNotifications.value = false;
    testNotifications.value = false;
  }
});

watchEffect(async () => {
  if (!messaging.value) return;

  if (messageNotifications.value) {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await subscribeToTopic({
        token: currentToken,
        topic: "message",
      });
    } catch (error) {
      console.error("Error subscribing FCM token to topic", error);
    }
  } else if (notificationPermission.value === "granted") {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await unsubscribeFromTopic({
        token: currentToken,
        topic: "message",
      });
    } catch (error) {
      console.error("Error unsubscribing FCM token from topic", error);
    }
  }
});

watchEffect(async () => {
  if (!messaging.value) return;

  if (susNotifications.value) {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await subscribeToTopic({
        token: currentToken,
        topic: "sus",
      });
    } catch (error) {
      console.error("Error subscribing FCM token to topic", error);
    }
  } else if (notificationPermission.value === "granted") {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await unsubscribeFromTopic({
        token: currentToken,
        topic: "sus",
      });
    } catch (error) {
      console.error("Error unsubscribing FCM token from topic", error);
    }
  }
});

watchEffect(async () => {
  if (!messaging.value) return;

  if (testNotifications.value) {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await subscribeToTopic({
        token: currentToken,
        topic: "test",
      });
    } catch (error) {
      console.error("Error subscribing FCM token to topic", error);
    }
  } else if (notificationPermission.value === "granted") {
    try {
      const currentToken = await getToken(messaging.value, {
        vapidKey:
          "BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8",
      });

      await unsubscribeFromTopic({
        token: currentToken,
        topic: "test",
      });
    } catch (error) {
      console.error("Error unsubscribing FCM token from topic", error);
    }
  }
});

const closeButtonRef = ref(null);
const isOpen = ref(false);

function setIsOpen(value: boolean) {
  isOpen.value = value;
}
</script>

<template>
  <div @click="setIsOpen(true)">
    <slot name="activator" />
  </div>
  <ClientOnly>
    <HeadlessDialog
      :initialFocus="closeButtonRef"
      :open="isOpen"
      @close="setIsOpen"
      class="relative z-50"
    >
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
      <!-- Full-screen container to center the panel -->
      <div class="fixed inset-0 flex w-screen items-center justify-center">
        <HeadlessDialogPanel
          class="h-full w-full transform overflow-hidden bg-slate-50 shadow-xl transition-all dark:bg-slate-900 md:h-auto md:max-w-3xl"
        >
          <HeadlessDialogTitle
            as="h2"
            class="flex items-center justify-between bg-slate-300 p-4 text-4xl font-medium dark:bg-slate-800"
          >
            <div>Settings</div>
            <div>
              <XCircleIcon
                ref="closeButtonRef"
                @click="setIsOpen(false)"
                class="w-8 cursor-pointer text-blue-500"
              />
            </div>
          </HeadlessDialogTitle>
          <div class="p-4">
            <section class="mb-4">
              <div class="mb-4">
                <h3 class="text-2xl font-medium">Notification settings</h3>
                <hr class="border-slate-400" />
              </div>
              <HeadlessSwitchGroup>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center">
                    <HeadlessSwitch
                      v-model="messageNotifications"
                      :class="
                        messageNotifications ? 'bg-blue-500' : 'bg-slate-400'
                      "
                      class="relative inline-flex h-7 w-14 shrink-0 items-center rounded-full"
                    >
                      <span class="sr-only">
                        <div class="text-lg">Enable message notifications</div>
                        <div class="text-md text-slate-500">
                          Get notified when Jerma sends a message in twitch chat
                        </div>
                      </span>
                      <span
                        :class="
                          messageNotifications
                            ? 'translate-x-8'
                            : 'translate-x-1'
                        "
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                      />
                    </HeadlessSwitch>
                    <HeadlessSwitchLabel class="ml-4">
                      <div class="text-lg">Enable message notifications</div>
                      <div class="text-md text-slate-500">
                        Get notified when Jerma sends a message in twitch chat
                      </div>
                    </HeadlessSwitchLabel>
                  </div>
                  <div class="flex items-center">
                    <HeadlessSwitch
                      v-model="susNotifications"
                      :class="susNotifications ? 'bg-blue-500' : 'bg-slate-400'"
                      class="relative inline-flex h-7 w-14 items-center rounded-full"
                    >
                      <span class="sr-only">
                        <div class="text-lg">Enable SUS! notifications</div>
                        <div class="text-md text-slate-500">
                          Get notified when the sus is updated
                        </div>
                      </span>
                      <span
                        :class="
                          susNotifications ? 'translate-x-8' : 'translate-x-1'
                        "
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                      />
                    </HeadlessSwitch>
                    <HeadlessSwitchLabel class="ml-4">
                      <div class="text-lg">Enable SUS! notifications</div>
                      <div class="text-md text-slate-500">
                        Get notified when the sus is updated
                      </div>
                    </HeadlessSwitchLabel>
                  </div>
                  <div class="flex items-center" v-if="false">
                    <HeadlessSwitch
                      v-model="testNotifications"
                      :class="
                        testNotifications ? 'bg-blue-500' : 'bg-slate-400'
                      "
                      class="relative inline-flex h-7 w-14 items-center rounded-full"
                    >
                      <span class="sr-only">
                        Get notified when the test is updated
                      </span>
                      <span
                        :class="
                          testNotifications ? 'translate-x-8' : 'translate-x-1'
                        "
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                      />
                    </HeadlessSwitch>
                    <HeadlessSwitchLabel class="ml-4">
                      <div class="text-lg">Enable test notifications</div>
                      <div class="text-md text-slate-500">
                        Get notified when a test message is sent
                      </div>
                    </HeadlessSwitchLabel>
                  </div>
                </div>
              </HeadlessSwitchGroup>
            </section>

            <section>
              <div class="mb-4">
                <h3 class="text-2xl font-medium">Other settings</h3>
                <hr class="border-slate-400" />
              </div>
              <HeadlessSwitchGroup>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center">
                    <HeadlessSwitch
                      v-model="hideMessageTimestamps"
                      :class="
                        hideMessageTimestamps ? 'bg-blue-500' : 'bg-slate-400'
                      "
                      class="relative inline-flex h-7 w-14 items-center rounded-full"
                    >
                      <span class="sr-only">
                        <div class="text-lg">Hide message timestamps</div>
                        <div class="text-md text-slate-500">
                          Hide the timestamps next to messages
                        </div>
                      </span>
                      <span
                        :class="
                          hideMessageTimestamps
                            ? 'translate-x-8'
                            : 'translate-x-1'
                        "
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                      />
                    </HeadlessSwitch>
                    <HeadlessSwitchLabel class="ml-4">
                      <div class="text-lg">Hide message timestamps</div>
                      <div class="text-md text-slate-500">
                        Hide the timestamps next to messages
                      </div>
                    </HeadlessSwitchLabel>
                  </div>

                  <div class="flex items-center">
                    <HeadlessSwitch
                      v-model="lightModeEnabled"
                      :class="lightModeEnabled ? 'bg-blue-500' : 'bg-slate-400'"
                      class="relative inline-flex h-7 w-14 items-center rounded-full"
                    >
                      <span class="sr-only">
                        <div class="text-lg">Enable light mode</div>
                        <div class="text-md text-slate-500">
                          Sets the sites theme to a lighter color
                        </div>
                      </span>
                      <span
                        :class="
                          lightModeEnabled ? 'translate-x-8' : 'translate-x-1'
                        "
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                      />
                    </HeadlessSwitch>
                    <HeadlessSwitchLabel class="ml-4">
                      <div class="text-lg">Enable light mode</div>
                      <div class="text-md text-slate-500">
                        Sets the sites theme to a lighter color
                      </div>
                    </HeadlessSwitchLabel>
                  </div>
                </div>
              </HeadlessSwitchGroup>
            </section>
          </div>
        </HeadlessDialogPanel>
      </div>
    </HeadlessDialog>
  </ClientOnly>
</template>

<style scoped></style>
