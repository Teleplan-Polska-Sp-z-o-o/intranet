<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { UserNotification } from "../../../models/common/notification/UserNotification";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";
import { useUserStore } from "../../../stores/userStore";
import { IUser } from "../../../interfaces/user/IUser";
import { UserNotificationManager } from "../../../models/common/notification/UserNotificationManager";
import { useWebsocketStore } from "../../../stores/websocketStore";
import { useNotificationStore } from "../../../stores/notificationStore";

const router = useRouter();

const websocketStore = useWebsocketStore();

const userStore = useUserStore();
const user: IUser | false = userStore.info();

const notificationManager = new UserNotificationManager();

const notifications = ref<Array<UserNotification>>([]);

const search = ref<string>("");
const notificationsFiltered = computed(() => {
  if (search.value) {
    return notifications.value.filter((notification: any) => {
      for (const key of ["title", "subtitle", "receivedDate"]) {
        let value;
        if (key === "receivedDate") {
          value = notification.getTime();
        } else {
          value = notification[key]?.toLowerCase();
        }
        const searchTerm = search.value.toLowerCase();
        if (value && value.includes(searchTerm)) {
          return true;
        }
      }
      return false;
    });
  } else return notifications.value;
});

const getNotifications = async (menu?: { [key: string]: boolean }) => {
  if (menu && menu["Unread"] === true && menu["Read"] === false) {
    notifications.value = user
      ? await notificationManager.get(user, ENotificationState.Unread)
      : [];
  } else if (menu && menu["Read"] === true && menu["Unread"] === false) {
    notifications.value = user ? await notificationManager.get(user, ENotificationState.Read) : [];
  } else if (menu && menu["Unread"] === true && menu["Read"] === true) {
    notifications.value = user ? await notificationManager.get(user) : [];
  } else notifications.value = [];
};

const notificationsLength = computed(() => notifications.value.length);

const notificationStore = useNotificationStore();

const menu = ref<{
  [key: string]: boolean;
}>(notificationStore.getNotificationMenu());

watch(
  () => notificationStore.getSignal,
  () => {
    getNotifications(menu.value);
  }
);

watch(
  menu,
  (newV) => {
    notificationStore.setNotificationMenu(menu.value);
    getNotifications(newV);
  },
  { deep: true }
);

watch(
  () => websocketStore.receivedMessages,
  () => {
    if (user) getNotifications(menu.value);
  },
  { deep: true }
);

const readNotification = async (notification: any) => {
  if (!user) throw new Error(`User from store evaluates to false. Please provide user info.`);

  let edited: any = null;
  if (notification.raw.state === ENotificationState.Unread)
    edited = await notificationManager.put(user, notification.raw.id, ENotificationState.Read);
  if (edited) notificationStore.sendSignal();
};

const handleNotificationClick = (item: any) => {
  readNotification(item);
  if (item.raw.link) router.push({ path: item.raw.link });
};

onMounted(() => getNotifications(menu.value));
</script>

<template>
  <v-card class="rounded-xl elevation-2 bg-surface-2 text-on-surface ma-1">
    <v-data-iterator :items="notificationsFiltered" :items-per-page="5" lines="three">
      <template v-slot:header>
        <v-toolbar>
          <v-menu location="bottom" offset="10px">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, index) in ['Unread', 'Read']" :key="index">
                <template v-slot:prepend>
                  <v-list-item-action start>
                    <v-checkbox-btn v-model="menu[item]"></v-checkbox-btn>
                  </v-list-item-action>
                </template>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-toolbar-title>Inbox</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
            class="mr-4"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <template v-for="(item, index) in items" :key="item.value">
          <v-list-item
            :href="undefined"
            @click="handleNotificationClick(item)"
            :class="index !== notificationsLength - 1 ? 'pb-2' : ''"
            :variant="item.raw.state === ENotificationState.Unread ? 'tonal' : 'text'"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.raw.action"></v-icon>
            </template>

            <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.raw.getTime() }}</v-list-item-subtitle>
            <span> {{ item.raw.subtitle }}</span>

            <template v-slot:append class="pl-8">
              {{ item.raw.getTimeElapsed() }}
            </template>
          </v-list-item>
          <v-divider v-if="index !== notificationsLength - 1"></v-divider>
        </template>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            icon="mdi-arrow-left"
            variant="tonal"
            rounded="xl"
            @click="prevPage"
          ></v-btn>

          <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>

          <v-btn
            :disabled="page >= pageCount"
            density="comfortable"
            icon="mdi-arrow-right"
            variant="tonal"
            rounded="xl"
            @click="nextPage"
          ></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-card>
</template>
