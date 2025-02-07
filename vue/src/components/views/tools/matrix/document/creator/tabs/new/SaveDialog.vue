<script setup lang="ts">
import { ref, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStepperStore } from "../../../../../../../../stores/documents/creator/useStepperStore";

const store = useStepperStore();

const name = ref<string>(store.stepper!.name || "");
const dialog = ref<boolean>(false);

// const router = computed(() => useRouter());
const route = useRoute();
const router = useRouter();
// const route: RouteLocationNormalizedLoadedGeneric = useRoute();

const save = async () => {
  await store.stepper!.save(unref(name).trim(), route);
  dialog.value = false;

  store.setStepper({
    navigation: {
      router,
    },
  });
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        prepend-icon="mdi-file-document-check-outline"
        color="primary"
        :variant="!store.stepper!.nextable ? 'flat' : 'tonal'"
        class="rounded-xl"
        >{{ $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.save`) }}</v-btn
      >
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        :title="
          $t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.saveDialog.title`)
        "
        :text="$t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.saveDialog.text`)"
      >
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Draft Name"
            variant="solo-filled"
            hint="The name will be used for identification and easier searching."
            prepend-icon="mdi-text-short"
          ></v-text-field>
          <div></div>
        </v-card-text>
        <v-card-actions>
          <v-card-actions :class="'px-4'">
            <v-spacer></v-spacer>
            <v-btn
              @click="isActive.value = false"
              class="rounded-xl"
              color="primary"
              variant="text"
              :text="$t('tools.common.cancel')"
            />
            <v-btn
              @click="save()"
              :disabled="!name.trim()"
              class="bg-primary text-on-primary mr-4 rounded-xl"
              :text="$t('tools.common.save')"
            />
          </v-card-actions>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
