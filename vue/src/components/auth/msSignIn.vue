<script setup lang="ts">
import { UserMSManager } from "../../models/user/UserMSManager";

// class="fab fa-microsoft"

const userMS = new UserMSManager();

const signIn = () => userMS.signIn();
</script>

<template>
  <v-btn @click="signIn" type="submit" class="rounded-xl mt-4">
    <i class="fab fa-microsoft"></i> Sign in with Microsoft
  </v-btn>
</template>
