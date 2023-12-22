<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import {
  XCircleIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/solid";
import { useSettings } from "../store/settings";
import { httpsCallable } from "firebase/functions";
import { getToken } from "firebase/messaging";
import { computed, watchEffect } from "vue";
import { messaging, functions } from "../firebase";
import { usePermission } from "@vueuse/core";

defineEmits(["close"]);

const settings = useSettings();

// Make sure layout exists
settings.layout = settings.layouts.findIndex(
  (layout) => layout.id === settings.layout.id
)
  ? settings.layout
  : settings.layouts[0];

const subscribeToTopic = httpsCallable(functions, "subscribeToTopic");

const unsubscribeFromTopic = httpsCallable(functions, "unsubscribeFromTopic");

const notificationPermission = usePermission("notifications");

const notificationPermissionIsDenied = computed(() => {
  return notificationPermission.value === "denied";
});

watchEffect(() => {
  if (
    notificationPermission.value &&
    notificationPermission.value !== "granted"
  ) {
    settings.notifications = false;
    settings.susNotifications = false;
    settings.testNotifications = false;
  }
});

watchEffect(async () => {
  if (settings.notifications) {
    try {
      const currentToken = await getToken(messaging, {
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
      const currentToken = await getToken(messaging, {
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
  if (settings.susNotifications) {
    try {
      const currentToken = await getToken(messaging, {
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
      const currentToken = await getToken(messaging, {
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
  if (settings.testNotifications) {
    console.log("sub to test notifications");
    try {
      const currentToken = await getToken(messaging, {
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
      const currentToken = await getToken(messaging, {
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
</script>

<template>
  <div
    class="md:max-w-3xl md:h-auto w-full h-full flex-auto bg-slate-900 text-slate-200 rounded-lg shadow-xl transform transition-all z-30"
  >
    <div
      class="flex justify-between items-center p-4 bg-slate-800 rounded-t-lg"
    >
      <div>
        <h1 class="text-lg font-bold">Settings</h1>
      </div>
      <div>
        <XCircleIcon
          @click="$emit('close')"
          class="w-6 text-blue-500 cursor-pointer"
        />
      </div>
    </div>

    <div class="p-4">
      <section class="mb-4">
        <div class="mb-4">
          <h2 class="text-xl font-medium">Choose a layout</h2>
          <hr class="border-slate-400" />
        </div>
        <div class="flex flex-wrap gap-8">
          <div class="flex-1">
            <p class="text-base text-slate-400">
              {{ settings.layout.description }}
            </p>
          </div>
          <div class="flex-1">
            <Listbox v-model="settings.layout">
              <ListboxButton
                class="relative w-80 pr-10 rounded-lg bg-slate-700 p-3 text-left shadow-md"
              >
                <span class="block truncate text-white font-medium">{{
                  settings.layout.name
                }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ChevronUpDownIcon
                    class="h-5 w-5 text-blue-500"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute z-10 w-80 mt-1 max-h-60 overflow-auto rounded-md bg-slate-700 py-1 shadow-lg"
                >
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="layout in settings.layouts"
                    :key="layout.name"
                    :value="layout"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-slate-800 text-white' : 'text-white',
                        'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ layout.name }}</span
                      >
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                      >
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-xl font-medium">Notification settings</h2>
          <hr class="border-slate-400" />
        </div>

        <SwitchGroup>
          <div
            v-if="notificationPermissionIsDenied"
            class="flex items-center justify-center gap-4 border border-rose-500 rounded-lg mb-4 p-4"
          >
            <ExclamationCircleIcon class="w-8 text-rose-600" />
            Notification permission must be allowed for notifications to work
          </div>
          <div class="flex items-center mb-4">
            <Switch
              v-model="settings.notifications"
              :disabled="notificationPermissionIsDenied"
              :class="[
                settings.notifications ? 'bg-blue-600' : 'bg-blue-500',
                { 'cursor-not-allowed': notificationPermissionIsDenied },
              ]"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Enable Notifications</span>
              <span
                :class="
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform transition duration-200 ease-in-out rounded-full bg-slate-200"
              />
            </Switch>
            <SwitchLabel
              :class="{ 'cursor-not-allowed': notificationPermissionIsDenied }"
              class="ml-4"
              >Enable Notifications</SwitchLabel
            >
          </div>

          <div class="flex items-center mb-4">
            <Switch
              v-model="settings.susNotifications"
              :disabled="notificationPermissionIsDenied"
              :class="[
                settings.notifications ? 'bg-blue-600' : 'bg-blue-500',
                { 'cursor-not-allowed': notificationPermissionIsDenied },
              ]"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Enable SUS! Notifications</span>
              <span
                :class="
                  settings.susNotifications ? 'translate-x-6' : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform transition duration-200 ease-in-out rounded-full bg-slate-200"
              />
            </Switch>
            <SwitchLabel
              :class="{ 'cursor-not-allowed': notificationPermissionIsDenied }"
              class="ml-4"
              >Enable SUS! Notifications</SwitchLabel
            >
          </div>

          <div v-if="true" class="flex items-center mb-4">
            <Switch
              v-model="settings.testNotifications"
              :disabled="notificationPermissionIsDenied"
              :class="[
                settings.notifications ? 'bg-blue-600' : 'bg-blue-500',
                { 'cursor-not-allowed': notificationPermissionIsDenied },
              ]"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Enable Test Notifications</span>
              <span
                :class="
                  settings.testNotifications ? 'translate-x-6' : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform transition duration-200 ease-in-out rounded-full bg-slate-200"
              />
            </Switch>
            <SwitchLabel
              :class="{ 'cursor-not-allowed': notificationPermissionIsDenied }"
              class="ml-4"
              >Enable Test Notifications</SwitchLabel
            >
          </div>
        </SwitchGroup>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-xl font-medium">Other settings</h2>
          <hr class="border-slate-400" />
        </div>

        <SwitchGroup>
          <div class="flex items-center mb-4">
            <Switch
              v-model="settings.timestamps"
              :class="settings.timestamps ? 'bg-blue-600' : 'bg-blue-500'"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Show Timestamps</span>
              <span
                :class="settings.timestamps ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform transition duration-200 ease-in-out rounded-full bg-slate-200"
              />
            </Switch>
            <SwitchLabel class="ml-4">Show Timestamps</SwitchLabel>
          </div>

          <div class="flex items-center mb-4">
            <Switch
              v-model="settings.fab"
              :class="settings.fab ? 'bg-blue-600' : 'bg-blue-500'"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Show floating action buttons</span>
              <span
                :class="settings.fab ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform transition duration-200 ease-in-out rounded-full bg-slate-200"
              />
            </Switch>
            <SwitchLabel class="ml-4">Show floating action buttons</SwitchLabel>
          </div>
        </SwitchGroup>
      </section>

      <div class="flex justify-end">
        <button
          @click="$emit('close')"
          class="bg-blue-500 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded shadow"
        >
          close
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
