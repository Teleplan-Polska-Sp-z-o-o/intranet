<script setup lang="ts">
import { nodeConfig } from "../../../config/env";

const translateOrigin = (v: string | undefined): string => {
  if (typeof v === "string") {
    return v.replace("http", "ws");
  }
  throw new Error("Origin resolves to undefined");
};

const socket = new WebSocket(`${translateOrigin(nodeConfig.origin)}:${nodeConfig.port}`);

socket.onopen = () => {
  console.log("Connected to WebSocket server");
};

socket.onmessage = (event) => {
  console.log("Received message:", event.data);
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error.message);
};

socket.onclose = () => {
  console.log("WebSocket connection closed");
};
</script>

<template>
  <v-chip prepend-icon="mdi-bell" variant="text" color="primary"> {{ 1 }} </v-chip>
</template>
