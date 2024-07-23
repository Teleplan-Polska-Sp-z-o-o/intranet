<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";

const emit = defineEmits(["close"]);
const props = defineProps<{
  user: string;
  variant: "register" | "unregister";
  manager: DocumentChangeManager | DocumentChangeNoticeManager;
  dc: DocumentChangeTypes.TDocumentChange;
}>();
const smallScreen = ref<boolean>(window.innerWidth < 960);

const { t } = useI18n();
const cancel = computed<string>(() => t(`tools.change.tabs.dcr.register.cancel`));
const confirm = computed<string>(() => t(`tools.change.tabs.dcr.register.confirm`));
const variant = computed<string>(() => t(`tools.change.tabs.dcr.register.${props.variant}`));
const question = t(`tools.change.tabs.dcr.register.question`);

const dialog = ref<boolean>(false);

const register = async (registered: boolean) => {
  try {
    if (props.user === props.dc.registerer) {
      await props.manager.registration(props.dc.id, registered, true);
    }

    dialog.value = false;
    emit("close");
  } catch (error) {
    console.error(`assess at DCRAssess error: ${error}`);
  }
};

const show = computed<boolean>(() => {
  return (
    (props.dc.status === "Approved" || props.dc.status === "Registered") &&
    props.user === props.dc.registerer
  );
});
</script>

<template>
  <v-dialog :max-width="smallScreen ? '80%' : '40%'" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="show"
        class="rounded-xl"
        color="orange"
        variant="tonal"
        :text="variant"
        v-bind="activatorProps"
      />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="rounded-xl">
        <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
          <div class="mb-4">{{ question }}</div>
        </v-card-text>

        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <v-spacer></v-spacer>
          <v-btn
            class="rounded-xl mr-4"
            color="primary"
            variant="text"
            @click="isActive.value = false"
            :text="cancel"
          />
          <v-btn
            class="rounded-xl"
            color="primary"
            variant="tonal"
            @click="register(props.dc.registered === true ? false : true)"
            :text="confirm"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
