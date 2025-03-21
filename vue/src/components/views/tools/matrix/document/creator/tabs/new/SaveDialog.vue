<script setup lang="ts">
import { onMounted, ref, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  EStatus,
  useStepperStore,
} from "../../../../../../../../stores/documents/creator/useStepperStore";
import { DocumentCreatorManager } from "../../../../../../../../models/document/creator/CreatorManager";
import { useI18n } from "vue-i18n";

const store = useStepperStore();
const { t } = useI18n();
const name = ref<string>(store.stepper!.name || "");
const dialog = ref<boolean>(false);

const manager = new DocumentCreatorManager();
const isValid = ref<boolean>(false);
const isValidText = ref<string>("");
// watch(dialog, (nd) => {
//   if (nd) console.log("store.stepper", store.stepper);
// });

const router = useRouter();
const route = useRoute();
// const router = useRouter();
// const route: RouteLocationNormalizedLoadedGeneric = useRoute();

const loading = ref<"secondary" | false>(false);

const save = async () => {
  try {
    loading.value = "secondary";

    await store.stepper!.save(unref(name).trim(), route);
  } catch (error) {
    throw error;
  } finally {
    store.clearStepper();
    loading.value = false;
    dialog.value = false;
    // store.setStepper({
    //   type: DocumentCreatorStepper.EStepperType.INSTRUCTION,
    //   // navigation: {
    //   //   router,
    //   // },
    // });
    router.push({ path: `/tool/tcd/browse/new` });
  }
};

onMounted(() => {
  (async () => {
    const modelBefore = store.stepper?.body.windows[2].model;
    if (modelBefore) {
      const { _id, _revision } = modelBefore;
      if (
        (_id && _revision && store.status.enum === EStatus.NEW) ||
        store.status.enum === EStatus.NEW_BASED
      ) {
        isValid.value = await manager.checkRevision(_id, _revision);

        if (isValid.value === false) {
          isValidText.value = t(
            `tools.matrix.tabs.documents.creator.createNew.stepper.actions.saveDialog.revisionInvalid`,
            { id: _id }
          );
        }
      } else isValid.value = true;
    } else isValid.value = false;
  })();
});
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
        :loading="loading"
      >
        <v-card-text>
          <v-alert v-if="!isValid" class="mb-6" :text="isValidText" border="start" type="warning">
          </v-alert>
          <v-text-field
            v-model="name"
            label="Draft Name"
            variant="solo-filled"
            hint="The name will be used for identification and easier searching."
            prepend-icon="mdi-text-short"
          ></v-text-field>
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
              :disabled="!name.trim() || isValid === false"
              class="bg-primary text-on-primary mr-4 rounded-xl"
              :text="$t('tools.common.save')"
            />
          </v-card-actions>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
