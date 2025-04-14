<script setup lang="ts">
import { ref, watch } from "vue";
import { DraftTypes } from "../../../DraftTypes";
import { useStepperStore } from "../../../../../../../../../../../stores/documents/creator/useStepperStore";
// import { useI18n } from "vue-i18n";

const store = useStepperStore();

// const { t } = useI18n();
const title = ""; // t(`tools.matrix.tabs.documents.creator.createNew.stepper.actions.saveDialog.title`)
const text = "";

const props = defineProps<{
  selectedTemplate: DraftTypes.EDraftTemplate;
}>();
const emit = defineEmits(["closing"]);

const dialog = ref<boolean>(false);

watch(dialog, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    emit("closing");
  }
});

watch(
  () => props.selectedTemplate,
  (template: DraftTypes.EDraftTemplate) => {
    if (template !== store.stepper!.getWindow(2).model.documentTemplate) {
      dialog.value = true;
    }
  }
);

const loading = ref<"secondary" | false>(false);

const save = async () => {
  try {
    loading.value = "secondary";

    store.stepper!.changeContentTemplate(props.selectedTemplate);
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    dialog.value = false;
  }
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:default="{ isActive }">
      <v-card :title="title" :text="text" :loading="loading">
        <v-card-text>
          <!-- <v-alert v-if="!isValid" class="mb-6" :text="isValidText" border="start" type="warning">
          </v-alert> -->
          <!-- <v-text-field
            v-model="name"
            label="Draft Name"
            variant="solo-filled"
            hint="The name will be used for identification and easier searching."
            prepend-icon="mdi-text-short"
          ></v-text-field> -->
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
              class="bg-primary text-on-primary mr-4 rounded-xl"
              :text="$t('tools.common.save')"
            />
          </v-card-actions>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
