<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IUser } from "../../../interfaces/user/IUser";
import { useUserStore } from "../../../stores/userStore";
import { useWebsocketStore } from "../../../stores/websocketStore";
import { UserNotificationManager } from "../../../models/common/notification/UserNotificationManager";
import { UserNotification } from "../../../models/common/notification/UserNotification";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";
import { useNotificationStore } from "../../../stores/notificationStore";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const listWidth = computed((): string => (smallScreen.value ? "300px" : "400px"));
const websocketStore = useWebsocketStore();

const userStore = useUserStore();
const user: IUser | false = userStore.info();

const notificationManager = new UserNotificationManager();
const notifications = ref<Array<UserNotification>>([]);
const notificationsLength = computed(() => notifications.value.length);
const plus = ref<boolean>(false);

const getNotifications = async (): Promise<void> => {
  const retrieved = user ? await notificationManager.get(user, ENotificationState.Unread, 4) : [];
  if (retrieved.length > 3) {
    plus.value = !!retrieved.pop();
  } else plus.value = false;
  notifications.value = retrieved;
};

const notificationStore = useNotificationStore();

watch(
  () => notificationStore.getBarSignal,
  () => {
    getNotifications();
    notificationStore.resetSignal("bar");
  }
);

const received = ref<Array<MessageEvent<any>>>(websocketStore.receivedMessages);
watch(received, () => getNotifications(), { deep: true });

const router = useRouter();

const readNotification = async (notification: UserNotification) => {
  if (!user) throw new Error(`User from store evaluates to false. Please provide user info.`);

  let edited: UserNotification | null = null;
  if (notification.state === ENotificationState.Unread)
    edited = await notificationManager.put(user, notification.id, ENotificationState.Read);
  if (edited) notificationStore.sendSignal();
};

const handleNotificationClick = (notification: any) => {
  readNotification(notification);
  if (notification.link) router.push({ path: notification.link });
};

onMounted(() => getNotifications());
</script>

<template>
  <v-menu location="start" offset="16px" class="rounded-xl pr-3">
    <template v-slot:activator="{ props }">
      <v-chip
        v-bind="props"
        prepend-icon="mdi-bell"
        variant="outlined"
        color="primary"
        class="ml-auto"
        :class="{ ringing: notificationsLength > 0 }"
      >
        {{ `${notificationsLength}${plus ? "+" : ""}` }}
      </v-chip>
    </template>

    <v-list variant="text" lines="three" rounded="xl" :width="listWidth">
      <v-list-subheader inset @click="router.push({ path: '/pages/settings/notification' })"
        ><v-btn variant="plain" text="Notification Center" class="text-decoration-underline"
      /></v-list-subheader>
      <v-list-subheader>Latest unread notifications.</v-list-subheader>
      <v-list-item v-if="!notificationsLength" class="pb-2">
        <v-list-item-title class="text-center"> Empty </v-list-item-title>
      </v-list-item>
      <template v-for="(notification, index) in notifications" :key="notification.id">
        <v-list-item
          :href="undefined"
          @click="handleNotificationClick(notification)"
          rounded="xl"
          :class="index === notificationsLength - 1 ? 'pb-2' : ''"
        >
          <template v-slot:prepend>
            <v-icon :icon="notification.action"></v-icon>
          </template>

          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.subtitle }}</v-list-item-subtitle>

          <template v-slot:append class="pl-8"> {{ notification.getTimeElapsed() }} </template>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<style scoped>
.ringing {
  animation: ring 5s infinite alternate; /* Animate the 'ring' animation infinitely */
}

@keyframes ring {
  0%,
  48% {
    transform: scale(1); /* Original size from 0% to 44% of each 5-second animation */
  }
  49%,
  51% {
    transform: scale(1.1); /* Scale the icon slightly from 45% to 55% of each 5-second animation */
  }
  52%,
  100% {
    transform: scale(1); /* Original size from 56% to 100% of each 5-second animation */
  }
}
</style>
