<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  EStatus,
  useStepperStore,
} from "../../../../../../../../stores/documents/creator/useStepperStore";
import { useRoute } from "vue-router";

const store = useStepperStore();
const route = useRoute();
const { t } = useI18n();

const functionality = computed(() => route.params.functionality);
const titleText = computed(() => {
  if (functionality.value === "new") {
    if (!!route.params.id && store.stepper !== null && store.status.enum === EStatus.EDIT) {
      return t(`tools.tcd.mainView.title.update`, {
        name: store.stepper!.name,
      });
    } else if (
      !!!route.params.id &&
      store.stepper !== null &&
      store.status.enum === EStatus.NEW_BASED
    ) {
      return t(`tools.tcd.mainView.title.basedOn`, {
        name: `${store.stepper!.body.windows[2].model._id}-${
          store.stepper!.body.windows[2].model._revision
        }`,
      });
    } else {
      return t(`tools.tcd.mainView.title.create`);
    }
  } else return;
});
</script>

<template>
  <v-alert
    v-if="titleText"
    :title="titleText"
    border="start"
    border-color="primary"
    type="info"
    variant="tonal"
    class="mx-4 my-3"
  >
  </v-alert>
</template>
