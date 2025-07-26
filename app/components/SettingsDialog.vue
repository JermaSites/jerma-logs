<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()

const route = useRoute()

const settingsStore = useSettingsStore()
const { messageNotifications, susNotifications, testNotifications } = storeToRefs(settingsStore)

const notificationPermission = usePermission('notifications')
const colorMode = useColorMode()

const { isSupported, getTokenAndSubscribeToTopic, getTokenAndUnsubscribeToTopic } = useFCM()

const isMessagingSupported = await isSupported()

const notificationPermissionDenied = computed(() => {
  return notificationPermission.value === 'denied' || !isMessagingSupported
})

const notificationPermissionGranted = computed(() => {
  return notificationPermission.value === 'granted'
})

const isDev = computed(() => {
  return Object.hasOwn(route.query, 'test')
})

// set all notification settings to false if permission is denied
watchEffect(() => {
  if (!!notificationPermission.value && !notificationPermissionGranted.value) {
    messageNotifications.value = false
    susNotifications.value = false
    testNotifications.value = false
  }
})

async function handleNotificationToggle(topic: string, enabled: boolean) {
  if (!notificationPermissionGranted.value)
    return

  try {
    if (enabled) {
      await getTokenAndSubscribeToTopic(topic)
    }
    else {
      await getTokenAndUnsubscribeToTopic(topic)
    }
  }
  catch (error) {
    console.error(`Error ${enabled ? 'subscribing to' : 'unsubscribing from'} ${topic}:`, error)
  }
}

watchEffect(async () => {
  await handleNotificationToggle('message', messageNotifications.value)
  await handleNotificationToggle('sus', susNotifications.value)
  await handleNotificationToggle('test', testNotifications.value)
})

const { hideMessageTimestamps, colorModeValue } = storeToRefs(settingsStore)

const lightModeEnabled = computed({
  get() {
    return colorMode.value === 'light'
  },
  set(enableLightMode) {
    colorMode.preference = enableLightMode ? 'light' : 'dark'
  },
})

watchEffect(() => {
  if (colorMode.value !== 'system')
    colorModeValue.value = colorMode.value
})
</script>

<template>
  <div class=" bg-slate-50 dark:bg-slate-800">
    <div class="flex items-center justify-between p-4 bg-slate-300  dark:bg-slate-900">
      <h1 class="text-4xl font-medium">
        Settings
      </h1>

      <div class="flex">
        <UIcon
          name="heroicons-solid:x-circle"
          class="size-8 cursor-pointer text-blue-500"
          @click="emit('close', true)"
        />
      </div>
    </div>

    <section class="p-4">
      <div class="mb-4">
        <h2 class="text-2xl font-medium">
          Notification settings
        </h2>
        <hr class="border-slate-400">
      </div>

      <div v-if="notificationPermissionDenied" class="mb-4 p-4 bg-red-500 dark:bg-red-900 rounded text-center text-xl text-white">
        <h3 class="text-4xl mb-4">
          Notifications are disabled or blocked
        </h3>
        <p>Please allow notifications in your web browser</p>
        <p>If on iOS add to Home Screen to allow notifications</p>
      </div>

      <div>
        <USwitch
          v-model="messageNotifications"
          :disabled="notificationPermissionDenied"
          color="secondary"
          size="xl"
          label="Enable message notifications"
          description="Get notified when Jerma sends a message in twitch chat"
          class="mb-4"
          :ui="{ base: 'data-[state=unchecked]:bg-slate-400' }"
        />

        <USwitch
          v-model="susNotifications"
          :disabled="notificationPermissionDenied"
          color="secondary"
          size="xl"
          label="Enable SUS! notifications"
          description="Get notified when the sus is updated"
          class="mb-4"
          :ui="{ base: 'data-[state=unchecked]:bg-slate-400' }"
        />

        <USwitch
          v-if="isDev"
          v-model="testNotifications"
          :disabled="notificationPermissionDenied"
          color="secondary"
          size="xl"
          label="Enable test notifications"
          description="Get notified when a test message is sent"
          class="mb-4"
          :ui="{ base: 'data-[state=unchecked]:bg-slate-400' }"
        />
      </div>

      <div class="mb-4">
        <h2 class="text-2xl font-medium">
          Other settings
        </h2>
        <hr class="border-slate-400">
      </div>

      <div>
        <USwitch
          v-model="hideMessageTimestamps"
          color="secondary"
          size="xl"
          label="Hide message timestamps"
          description="Hide the timestamps next to messages"
          class="mb-4"
          :ui="{ base: 'data-[state=unchecked]:bg-slate-400' }"
        />

        <USwitch
          v-model="lightModeEnabled"
          color="secondary"
          size="xl"
          label="Enable light mode"
          description="Sets the sites theme to a lighter color"
          class="mb-4"
          :ui="{ base: 'data-[state=unchecked]:bg-slate-400' }"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
