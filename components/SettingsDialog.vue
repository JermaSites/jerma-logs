<script setup lang="ts">
import type { Messaging } from 'firebase/messaging'
import { getMessaging, isSupported } from 'firebase/messaging'

const emit = defineEmits<{ close: [boolean] }>()

const settingsStore = useSettingsStore()

const { messageNotifications, susNotifications } = storeToRefs(settingsStore)

const notificationPermission = usePermission('notifications')

const notificationPermissoinDenied = computed(() => {
  return notificationPermission.value === 'denied'
})

const messaging = ref<Messaging>()
const { app } = useFirebase()

// check for FCM support
onMounted(async () => {
  const messageSupport = await isSupported()
  if (!messageSupport)
    return

  messaging.value = getMessaging(app)
})

const { getTokenAndSubscribeToTopic, getTokenAndUnsubscribeToTopic } = useFCM()

watch(susNotifications, async () => {
  if (!messaging.value)
    return

  if (susNotifications.value)
    getTokenAndSubscribeToTopic(messaging.value, 'message')
  else if (notificationPermission.value === 'granted')
    getTokenAndUnsubscribeToTopic(messaging.value, 'message')
})

watch(messageNotifications, async () => {
  if (!messaging.value)
    return

  if (messageNotifications.value)
    getTokenAndSubscribeToTopic(messaging.value, 'message')
  else if (notificationPermission.value === 'granted')
    getTokenAndUnsubscribeToTopic(messaging.value, 'message')
})

// set all notification settings to false if permission is denied
watchEffect(() => {
  if (!!notificationPermission.value && notificationPermission.value !== 'granted') {
    susNotifications.value = false
    messageNotifications.value = false
  }
})

const { hideMessageTimestamps } = storeToRefs(settingsStore)

const colorMode = useColorMode()

const lightModeEnabled = computed({
  get() {
    return colorMode.value === 'light'
  },
  set(enableLightMode) {
    colorMode.preference = enableLightMode ? 'light' : 'dark'
  },
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

      <div>
        <USwitch
          v-model="messageNotifications"
          :disabled="notificationPermissoinDenied"
          color="secondary"
          size="xl"
          label="Enable message notifications"
          description="Get notified when Jerma sends a message in twitch chat"
          class="mb-4"
        />

        <USwitch
          v-model="susNotifications"
          :disabled="notificationPermissoinDenied"
          color="secondary"
          size="xl"
          label="Enable SUS! notifications"
          description="Get notified when the sus is updated"
          class="mb-4"
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
        />

        <USwitch
          v-model="lightModeEnabled"
          color="secondary"
          size="xl"
          label="Enable light mode"
          description="Sets the sites theme to a lighter color"
          class="mb-4"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
