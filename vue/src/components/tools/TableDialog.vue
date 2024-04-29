<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed, ComputedRef, watchEffect } from "vue";

const { t } = useI18n();
const emit = defineEmits(["close", "confirm", "save-data", "verified"]);
const props = defineProps<{
  variant: string;
  disable?: boolean;
  confirmDisable?: boolean;
  index: number;
  loading: boolean;
  deleteTMsg?: string;
  showBtn: boolean;
}>();

const variant: "Save" | "Delete" = props.variant as "Save" | "Delete";
const disable = ref<boolean>(props.disable ?? false);
const confirmDisable = ref<boolean>(props.confirmDisable ?? false);
const index = ref<number>(props.index);
const loading = ref<boolean>(props.loading);
const deleteTMsg: string | undefined = props.deleteTMsg;
const showBtn = props.showBtn;

const title = computed<string>(() => {
  switch (variant) {
    case "Delete":
      return t("tools.common.delete");
    case "Save":
      return index.value === -1 ? t("tools.common.new") : t("tools.common.edit");
    default:
      return "";
  }
});
const cancel = computed<string>(() => t("tools.common.cancel"));

let confirm: ComputedRef<string>;
if (variant === "Save") {
  confirm = computed(() => t("tools.common.save"));
} else if (variant === "Delete") {
  confirm = computed(() => t("tools.common.ok"));
}

const deleteMessage: string = t(`tools.common.${deleteTMsg ?? "deleteItemConfirmation"}`);

watchEffect(() => {
  disable.value = props.disable;
  confirmDisable.value = props.confirmDisable;
  index.value = props.index;
  loading.value = props.loading;
});

//
const smallScreen = ref<boolean>(window.innerWidth < 960);
</script>

<template>
  <v-dialog :max-width="smallScreen ? '90vw' : '60vw'" max-height="80vh">
    <template v-if="variant === 'Save'" v-slot:activator="{ props: dialog }">
      <v-tooltip text="Add new record.">
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            class="bg-primary text-on-primary mr-4 rounded-xl"
            height="40px"
            icon="mdi-plus"
            v-bind="{ ...dialog, ...tooltip }"
            :disabled="disable"
            v-show="showBtn"
          />
        </template>
      </v-tooltip>
    </template>

    <v-card :loading="loading" color="primary" variant="outlined" class="bg-background rounded-xl">
      <v-card-title :class="smallScreen ? 'px-4' : 'px-10'">
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert
                v-if="variant === 'Delete'"
                class="mx-4 mb-8"
                :text="deleteMessage"
                border="start"
                type="warning"
              >
              </v-alert>
              <slot v-else></slot>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
        <v-spacer></v-spacer>
        <v-btn
          class="rounded-xl"
          color="primary"
          variant="text"
          @click="emit('close')"
          :text="cancel"
        />
        <v-btn
          class="bg-primary text-on-primary mr-4 rounded-xl"
          @click="emit('confirm')"
          :disabled="confirmDisable"
          :text="confirm"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
