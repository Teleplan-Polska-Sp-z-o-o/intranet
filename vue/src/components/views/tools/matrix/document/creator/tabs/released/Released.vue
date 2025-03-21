<script setup lang="ts">
import ArchivedTable from "./ArchivedTable.vue";
import ReleasedTable from "./ReleasedTable.vue";
import { useUserStore } from "../../../../../../../../stores/userStore";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";
import { onMounted, ref } from "vue";

const isUserEligible = ref<boolean>(false);
const stepperStore = useStepperStore();
const userStore = useUserStore();

onMounted(() => {
  (async () => {
    const user = userStore.info();
    if (!user) {
      return;
    } else {
      isUserEligible.value = stepperStore.DOCUMENT_CONTROLLERS.includes(user.username);
    }
  })();
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <v-container fluid>
      <v-row no-gutters :class="{ 'mb-8': isUserEligible }">
        <v-col :cols="12">
          <released-table></released-table>
        </v-col>
      </v-row>
      <v-row v-if="isUserEligible" no-gutters>
        <v-col :cols="12">
          <archived-table></archived-table>
        </v-col>
      </v-row>
    </v-container>
  </v-fade-transition>
</template>
