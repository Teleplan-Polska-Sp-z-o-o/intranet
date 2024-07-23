<script setup lang="ts">
import { computed, ComputedRef, ref, watchEffect } from "vue";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { useUserStore } from "../../../../../stores/userStore";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { SimpleUser } from "../../../../../models/user/SimpleUser";
import DCRAssess from "./DCRAssess.vue";
import DCRRegister from "./DCRRegister.vue";
// import { nodeConfig } from "../../../../../config/env";
// import { Endpoints } from "../../../../../config/Endpoints";
// import axios from "axios";
import { IFileItem } from "../../../../../interfaces/document/DocumentTypes";
import { FileItem } from "../../../../../models/document/FileItem";
import { Helper } from "../../../../../models/common/Helper";
import { DocumentChangeNoticeManager } from "../../../../../models/change/dc/DocumentChangeNoticeManager";
import { FileHelper } from "../../../../../models/common/Files/FileHelper";

const emit = defineEmits(["loadItems"]);
const smallScreen = ref<boolean>(window.innerWidth < 960);
const props = defineProps<{
  item: DocumentChangeTypes.TDocumentChange;
  tab: string;
  manager: DocumentChangeManager | DocumentChangeNoticeManager;
}>();
const router: Router = useRouter();

const openDialog = () => {
  try {
    router.push({
      path: `/tool/change/browse/${props.tab}/${props.item.id}`,
    });
  } catch (error) {
    console.error(`open dialog at DCRReview, ${error}`);
  }
};

const closeDialog = () => {
  try {
    router.push({
      path: `/tool/change/browse/${props.tab}`,
    });
  } catch (error) {
    console.error(`close dialog at DCRReview, ${error}`);
  }
};

const dialog = ref<boolean>(false);

const newRoute: RouteLocationNormalizedLoaded = useRoute();
watchEffect(() => {
  try {
    if (!newRoute) {
      return;
    }

    if (!newRoute.params.tab || !newRoute.params.no) {
      dialog.value = false;
      return;
    }

    if (Array.isArray(newRoute.params.tab) || Array.isArray(newRoute.params.no)) {
      return;
    }

    if (newRoute.params.tab === props.tab && parseInt(newRoute.params.no) === props.item.id) {
      dialog.value = true;
    }
  } catch (error) {
    console.error(`watch for useRoute at DCRReview, ${error}`);
  }
});

// files
const retrievedBlobs = ref<Array<Blob>>([]);
const retrievedFiles = ref<Array<File>>([]);
const retrievedFileItems = ref<Array<IFileItem>>([]);
(async () => {
  const fileNames: string[] = JSON.parse(props.item.fileNames);
  if (fileNames.length > 0) {
    for (const [index, name] of Object.entries(fileNames)) {
      try {
        const retrieved = await new FileHelper(name, "docx").retrieveFromServer();

        if (!retrieved.file) throw new Error("retrieved file at FileHelper is null");
        if (!retrieved.blob) throw new Error("retrieved blob at FileHelper is null");
        const langs = name.match(/qs_langs=([^&]*)/)![1];
        const fileItem: FileItem = new FileItem(parseInt(index, 10), [retrieved.file], [langs]);
        retrievedBlobs.value.push(retrieved.blob);
        retrievedFiles.value.push(retrieved.file);
        retrievedFileItems.value.push(fileItem);
      } catch (error) {
        console.error(`Error fetching files at DCRReview`, error);
      }
    }
  }
})();

// timeline
const timeline: ComputedRef<DocumentChangeTypes.Processing.TTimeline> = computed(() =>
  JSON.parse(props.item.timeline)
);
const getDotColor = (status: DocumentChangeTypes.TStatus): string => {
  return DocumentChangeTypes.Processing.ETimelineElementColor[status];
};

// user for review
const userStore = useUserStore();
const user: IUserEntity | false = userStore.info();
if (!user) throw new Error("User at DCRReview.vue resolve to false.");
const simpleUser = new SimpleUser().build(user).getNormalizedUsername();

const formatAtDate = (isoDate: string) => {
  const timeRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
  const ISOLocalTime = Helper.convertToLocalTime(isoDate);
  return ISOLocalTime.match(timeRegex)?.[0];
};

const assessCheckOrApprove: ComputedRef<"check" | "approve"> = computed<"check" | "approve">(() => {
  const isChecked = props.item.checked;
  const isApprover = props.item.approver === simpleUser;

  if (isChecked && isApprover) return "approve";
  else return "check";
});

const openFile = (name: string, index: number) => {
  const blob = retrievedBlobs.value.at(index);
  if (blob instanceof Blob) new FileHelper(name, "docx").downloadBlob(blob);
};
</script>

<template>
  <v-dialog
    v-model="dialog"
    @update:modelValue="(value: boolean) => {
    if (!value) closeDialog()
  }"
    :max-width="smallScreen ? '90vw' : '60vw'"
    max-height="80vh"
  >
    <template v-slot:activator>
      <v-tooltip :text="$t(`tools.change.tabs.dcr.review.tooltip`)">
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            color="primary"
            variant="tonal"
            class="rounded-lg"
            :size="56"
            v-bind="{ ...tooltip }"
            @click="openDialog"
          >
            <v-icon icon="mdi-file-sign" :size="24" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default>
      <v-card color="primary" variant="text" class="bg-background rounded-xl">
        <v-card-title :class="smallScreen ? 'px-4' : 'px-10'">
          <span class="text-h5">{{ $t(`tools.change.tabs.dcr.review.title`) }}</span>
        </v-card-title>

        <v-card-text :class="smallScreen ? 'px-2' : 'px-10'">
          <v-list lines="three">
            <!-- Files -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.files`) }}</v-list-subheader>
            <v-list-item
              v-if="retrievedFileItems.length"
              v-for="(file, index) in retrievedFileItems"
              :key="file.id"
              :class="{ 'pt-0': index !== 0 }"
            >
              <v-list-item-title class="w-50"> {{ file.file?.at(0)?.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-btn icon variant="text" class="ma-2">
                  <v-icon
                    icon="mdi-file-download-outline"
                    color="secondary"
                    @click="openFile(file.file!.at(0)!.name, index)"
                  ></v-icon>
                </v-btn>
                <!-- <v-icon icon="mdi-file-search-outline" size="x-large" class="ma-2"></v-icon> -->
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-title
                >{{ $t(`tools.change.tabs.dcr.review.no_files`) }}
              </v-list-item-title>
            </v-list-item>

            <!-- Changes -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.changes`) }}</v-list-subheader>
            <v-list-item
              v-html="props.item.affected"
              class="ck-pt-4 pt-0"
              style="min-height: 0"
            ></v-list-item>

            <!-- Timeline -->
            <v-list-subheader>{{ $t(`tools.change.tabs.dcr.review.timeline`) }}</v-list-subheader>
            <v-list-item>
              <v-timeline align="start" density="compact">
                <v-timeline-item
                  v-for="element in timeline"
                  :key="element.id"
                  :dot-color="getDotColor(element.status)"
                  size="x-small"
                >
                  <div class="mb-4">
                    <div class="font-weight-normal mb-2">
                      <v-chip
                        class="ms-0 me-2"
                        :color="getDotColor(element.status)"
                        size="small"
                        label
                      >
                        {{ element.status }}
                      </v-chip>
                      <strong>{{ element.issuer }}</strong> @{{
                        formatAtDate(new Date(element.date).toISOString())
                      }}
                    </div>
                    <div v-if="element.comment">
                      {{ `${$t(`tools.change.tabs.dcr.review.comment`)}: ${element.comment}` }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <d-c-r-assess
            :user="simpleUser"
            variant="reject"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          >
          </d-c-r-assess>
          <d-c-r-assess
            :user="simpleUser"
            :variant="assessCheckOrApprove"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          >
          </d-c-r-assess>

          <d-c-r-register
            :user="simpleUser"
            :variant="props.item.registered ? 'unregister' : 'register'"
            :manager="props.manager"
            :dc="props.item"
            @close="emit('loadItems')"
          ></d-c-r-register>

          <v-spacer></v-spacer>

          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            :text="$t(`tools.change.tabs.dcr.review.close`)"
            @click="closeDialog()"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
