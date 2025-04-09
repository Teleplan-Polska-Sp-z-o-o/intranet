<script setup lang="ts">
import { ref, toRefs, unref, watch } from "vue";
import { FileCardTypes } from "../../../../../../interfaces/analytic/fileCardTypes";
import { useAnalyticStore } from "../../../../../../stores/analytic/useAnalyticStore";
import { AnalyticFileTypes } from "../Types";
import { TimeHelper } from "../../../../../../models/common/TimeHelper";

const emit = defineEmits(["menu-click"]);
const store = useAnalyticStore();
const props = defineProps<{
  /**
   * file uuid
   */
  uuid: string;

  fileEntity: AnalyticFileTypes.IAnalyticFileEntity;
}>();

// Destructure stopLoading to keep it reactive
const { uuid } = toRefs(props);
// Create a reactive loading map that holds the loading states for each ID
const loadingIds = ref<number[]>([]);
watch(
  () => store.loadingActions[unref(uuid)],
  (newVal: number[]) => {
    loadingIds.value = newVal;
  },
  { deep: true }
);

// Handle clicking an item: set it as true (loading)

const handleOperation = (args: [number, string | undefined]) => {
  emit("menu-click", ...args, uuid.value);
};
// Watch for changes in stopLoading array to remove stopped loading IDs from loadingMap
// watch(
//   loadingIds,
//   (newIds, oldIds) => {
//     // Find IDs that were in the old array but are no longer in the new array (i.e., finished loading)
//     const stoppedLoadingIds = oldIds.filter((id) => !newIds.includes(id));
//     // Remove stopped loading IDs from the loadingMap
//     stoppedLoadingIds.forEach((id) => {
//       if (loadingMap.value.has(id)) {
//         loadingMap.value.delete(id); // Remove from the loading map
//       }
//     });
//   },
//   { deep: true }
// );

const fileSubMenus = {
  dialog: {
    id: 5,
    label: "dialog",
    color: undefined,
    icon: "mdi-eye-outline",
  },
  // NewTab: { id: 6, label: "new tab", color: undefined, icon: "mdi-open-in-new" },
  // Excel: {
  //   id: 7,
  //   label: "excel",
  //   color: undefined,
  //   icon: "mdi-file-excel-box-outline",
  // },
};

const fileMenu: Record<string, FileCardTypes.FileMenuItem> = {
  Open: {
    id: 1,
    label: "open in",
    color: undefined,
    icon: "mdi-arrow-all",
    nested: [
      {
        subId: fileSubMenus.dialog.id,
        label: fileSubMenus.dialog.label,
        color: undefined,
        icon: fileSubMenus.dialog.icon,
      },
      // {
      //   subId: fileSubMenus.NewTab.id,
      //   label: fileSubMenus.NewTab.label,
      //   color: undefined,
      //   icon: fileSubMenus.NewTab.icon,
      // },
      // {
      //   subId: fileSubMenus.Excel.id,
      //   label: fileSubMenus.Excel.label,
      //   color: undefined,
      //   icon: fileSubMenus.Excel.icon,
      // },
    ],
  },
  Info: {
    id: 8,
    label: "file info",
    color: undefined,
    icon: "mdi-information-outline",
    nested: [
      {
        subId: 9,
        label: "",
        color: undefined,
        icon: "",
      },
    ],
  },
  Download: {
    id: 2,
    label: "download",
    color: undefined,
    icon: "mdi-tray-arrow-down",
    nested: undefined,
  },
  Update: {
    id: 3,
    label: "update",
    color: "warning",
    icon: "mdi-file-edit-outline",
    nested: undefined,
  },
  Delete: {
    id: 4,
    label: "delete",
    color: "error",
    icon: "mdi-trash-can-outline",
    nested: undefined,
  },
};
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props: menu }">
      <v-tooltip>
        <template v-slot:activator="{ props: tooltip }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="{ ...menu, ...tooltip }"></v-btn>
        </template>
        <span v-text="'File Actions'"></span>
      </v-tooltip>
    </template>
    <v-list density="compact">
      <!-- :disabled="menuItem.id === 8" -->
      <v-list-item
        v-for="menuItem in fileMenu"
        :key="menuItem.id"
        :value="menuItem.id"
        :class="{ [`text-${menuItem.color}`]: menuItem.color }"
        @click="() => handleOperation([menuItem.id, menuItem.color])"
        :title="menuItem.label"
      >
        <template v-slot:prepend>
          <v-icon :icon="menuItem.icon"></v-icon>
        </template>

        <template v-slot:append>
          <v-sheet width="24px">
            <v-progress-circular
              v-if="loadingIds.includes(menuItem.id) && !menuItem.nested"
              indeterminate
              size="24"
              :color="menuItem.color ?? 'secondary'"
              class="ml-2"
            ></v-progress-circular>
            <v-icon v-if="menuItem.nested" icon="mdi-menu-right" size="small"></v-icon>
          </v-sheet>
        </template>

        <template v-slot:default>
          <v-menu
            v-if="menuItem.id === 8"
            :open-on-focus="false"
            open-on-hover
            :close-on-content-click="false"
            activator="parent"
            submenu
          >
            <v-card max-width="300px">
              <v-card-text class="overflow-y-auto" style="max-height: 300px">
                <v-list lines="one" density="compact">
                  <v-list-item v-text="`File Type: ${fileEntity.fileType}`" />
                  <v-list-item>
                    <span>Created By:</span>
                    <div>
                      {{ fileEntity.createdBy.user.username }} -
                      {{
                        TimeHelper.removeTimezone(
                          TimeHelper.convertToLocalTime(fileEntity.createdBy.date)
                        )
                      }}
                    </div>
                  </v-list-item>
                  <v-list-item v-if="fileEntity.updatedBy.length">
                    <span>Updated By:</span>
                    <div v-for="u in fileEntity.updatedBy">
                      {{ u.user.username }} -
                      {{ TimeHelper.removeTimezone(TimeHelper.convertToLocalTime(u.date)) }}
                    </div>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  variant="text"
                  block
                  :disabled="!!!fileEntity.archive"
                  :loading="loadingIds.includes(9)"
                  @click="() => handleOperation([9, 'secondary'])"
                  >Restore Previous Version</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-menu
            v-else-if="menuItem.nested && menuItem.id !== 8"
            :open-on-focus="false"
            open-on-hover
            :close-on-content-click="false"
            activator="parent"
            submenu
          >
            <v-list density="compact">
              <v-list-item
                v-for="nestedMenuItem in menuItem.nested"
                :key="nestedMenuItem.subId"
                link
                @click="() => handleOperation([nestedMenuItem.subId, nestedMenuItem.color])"
              >
                <template v-slot:prepend>
                  <v-icon :icon="nestedMenuItem.icon"></v-icon>
                </template>

                <v-list-item-title>{{ nestedMenuItem.label }}</v-list-item-title>

                <template v-slot:append>
                  <v-sheet width="24px">
                    <v-progress-circular
                      v-if="loadingIds.includes(nestedMenuItem.subId)"
                      indeterminate
                      size="24"
                      :color="nestedMenuItem.color ?? 'secondary'"
                      class="ml-2"
                    ></v-progress-circular>
                  </v-sheet>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
