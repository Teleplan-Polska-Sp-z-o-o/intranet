<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { INewsEntity } from "../../../../interfaces/editor/INewsEntity";
import CkEditor from "../../../common/CkEditor.vue";
import VerifyTables from "./VerifyTables.vue";
import { useEditorStore } from "../../../../stores/editorStore";
import { watch } from "vue";
import { Permission } from "../../../../models/user/Permission";
import { IPermission, TPermissionStringCode } from "../../../../interfaces/user/UserTypes";
import { usePermissionStore } from "../../../../stores/permissionStore";
import { nodeConfig } from "../../../../config/env";
import { Endpoints } from "../../../../config/Endpoints";
import axios from "axios";

const emit = defineEmits(["save-data", "verified"]);

const props = defineProps<{
  componentProps: any;
}>();

const smallScreen = ref<boolean>(window.innerWidth < 960);

const activeStep = ref<number>(1);
const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
const nextStep = () => {
  if (activeStep.value < 4) {
    activeStep.value++;
  }
};
const prevable = computed(() => activeStep.value > 1);
const nextable = computed(() => activeStep.value < 4);

const bgImage = ref<Array<File>>([]);
const news = ref<INewsEntity>(props.componentProps.editedItem);

const setPermission = (val: string | null) => {
  if (val) news.value.permission = new Permission(val as TPermissionStringCode);
};

const getPermission = (per: IPermission) => {
  const permissionStore = usePermissionStore();
  const code = permissionStore.translatePermissionToStringCode(per) as TPermissionStringCode;
  return code;
};

const newsPermissionSelect = ref<string>("user");

watchEffect(() => {
  news.value = props.componentProps.editedItem;
});

const editorStore = useEditorStore();

(async () => {
  const newsRef = news.value.ref;
  newsPermissionSelect.value = getPermission(news.value.permission);
  const newsTitle = news.value.title;
  const newsSubtitle = news.value.subtitle;
  const newsContent = news.value.content;
  editorStore.save(newsContent, "news");
  const newsBgImage = news.value.bgImage;
  if (newsRef && newsTitle && newsSubtitle && newsContent && newsBgImage) {
    const constructBgImgSrc = (): string => {
      const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/news/`;
      return `${backend}${newsBgImage}`;
    };

    const fileUrl = constructBgImgSrc();
    try {
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const fileContent = response.data;
      const blob = new Blob([fileContent]);
      //?.split(".")[0]
      const name = fileUrl.split("/").pop();
      if (!name) throw new Error("Failed to extract file name from URL");

      const file = new File([blob], name, { type: response.headers["content-type"] });
      bgImage.value = [file];
    } catch (error) {
      console.error(error);
    }
  }
})();

const handleRef = (ref: string) => {
  if (!news.value.ref) news.value.ref = ref;
};

const hasBgImage = computed<boolean>(() => bgImage.value.length > 0);

watch(activeStep, (newStep, oldStep) => {
  if (oldStep === 3 && newStep === 4) news.value.content = editorStore.get("news");
});

const hasContent = computed<boolean>(() => {
  return news.value.content !== `<div class="ck-override-vuetify-styles"></div><div></div>`;
});

const newNewsData = computed(() => {
  return {
    ref: news.value.ref,
    permission: news.value.permission,
    title: news.value.title,
    subtitle: news.value.subtitle,
    content: news.value.content,

    bgImage: bgImage.value,
  };
});

watchEffect(() => {
  if (
    !!news.value.title &&
    !!news.value.subtitle &&
    hasContent.value &&
    hasBgImage.value &&
    activeStep.value === 4
  ) {
    emit("verified", false);
    emit("save-data", newNewsData.value);
  } else {
    emit("verified", true);
  }
});
</script>

<template>
  <v-stepper :mobile="smallScreen ? true : false" v-model="activeStep" class="rounded-xl">
    <v-stepper-header class="rounded-xl">
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 1 && !!news.title && !!news.subtitle"
        :value="1"
        title="Base Info"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 2 && hasBgImage"
        :value="2"
        title="Input Background Image"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 3 && hasContent"
        :value="3"
        title="Content"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        color="secondary"
        :complete="activeStep > 4"
        :value="4"
        title="Verify"
      ></v-stepper-item>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item :value="1">
        <v-card flat>
          <v-select
            v-model:model-value="newsPermissionSelect"
            @update:modelValue="setPermission"
            variant="underlined"
            label="Permission"
            :items="['user', 'moderator', 'admin']"
          ></v-select>
          <v-text-field v-model="news.title" variant="underlined" label="Title"></v-text-field>
          <v-text-field
            v-model="news.subtitle"
            variant="underlined"
            label="Subtitle"
          ></v-text-field>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="2">
        <v-card flat>
          <v-file-input
            v-model="bgImage"
            label="Background Image"
            accept="image/*"
            variant="underlined"
            class="text-no-wrap overflow-hidden mr-4"
          >
          </v-file-input>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="3">
        <v-card flat>
          <ck-editor :endpoint="Endpoints.News" editorKey="news" @ref="handleRef"></ck-editor>
        </v-card>
      </v-stepper-window-item>

      <v-stepper-window-item :value="4">
        <v-card flat>
          <verify-tables :eNews="news" :bgImage="bgImage"></verify-tables>
        </v-card>
      </v-stepper-window-item>
    </v-stepper-window>

    <template v-slot:actions>
      <v-card-actions class="mx-6 mb-6 rounded-xl">
        <v-btn
          @click="prevStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!prevable"
          >Previous</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="nextStep"
          color="secondary"
          variant="text"
          class="rounded-xl"
          :disabled="!nextable"
          >Next</v-btn
        >
      </v-card-actions>
    </template>
  </v-stepper>
</template>
