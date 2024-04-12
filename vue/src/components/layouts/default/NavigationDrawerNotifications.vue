<script setup lang="ts">
import { IUser } from "../../../interfaces/user/IUser";
import { usePermissionStore } from "../../../stores/permissionStore";
import { useUserStore } from "../../../stores/userStore";
import { useWebsocketStore } from "../../../stores/websocketStore";

const websocketStore = useWebsocketStore();

let socket = websocketStore.getSocket();
if (socket === null) {
  websocketStore.initSocket();
  socket = websocketStore.getSocket();
}

const userStore = useUserStore();
const user: IUser | false = userStore.info();

const permissionStore = usePermissionStore();
const permission = permissionStore.getPermissionCode() as "user" | "moderator" | "admin";

if (permission !== "user" && socket !== null) {
  socket.onopen = () => {
    socket?.send(JSON.stringify({ user }));
  };

  socket.onmessage = (event: MessageEvent) => {
    console.log("Received message:", event.data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", (error as ErrorEvent).message);
  };

  socket.onclose = () => {
    socket?.send(JSON.stringify({ userToRemove: user }));
  };
}
</script>

<template>
  <v-chip prepend-icon="mdi-bell" variant="outlined" color="primary" class="ml-auto">
    {{ 1 }}
  </v-chip>
</template>
