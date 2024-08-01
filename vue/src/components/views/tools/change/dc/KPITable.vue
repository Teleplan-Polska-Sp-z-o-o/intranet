<script setup lang="ts">
import { computed, ComputedRef, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { DocumentChangeManager } from "../../../../../models/change/dc/DocumentChangeManager";
import { TimeHelper } from "../../../../../models/common/TimeHelper";
import { RoleAction } from "../../../../../models/change/dc/RoleAction";
import { SimpleUser } from "../../../../../models/user/SimpleUser";
import { useUserStore } from "../../../../../stores/userStore";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { IChip } from "../../../../../interfaces/document/DocumentTypes";
import { IUserEntity } from "../../../../../interfaces/user/IUserEntity";
import { UserManager } from "../../../../../models/user/UserManager";
import { useDCRStore } from "../../../../../stores/change/dcrStore";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const tPath = `tools.change.tabs.dcr.kpi.table`;
const tableHeaders: any = [
  {
    title: t(`${tPath}.header.no`),
    align: "start",
    key: "no",
  },
  { title: t(`${tPath}.header.username`), key: "username" },
  { title: t(`${tPath}.header.role`), key: "role" },

  {
    title: t(`${tPath}.header.since`),
    key: "since",
  },
  {
    title: t(`${tPath}.header.taken`),
    key: "taken",
  },
  {
    title: t(`${tPath}.header.elapsed`),
    key: "elapsed",
  },
];
const toolbarTitle = t(`${tPath}.toolbar`);

const tableSearch = ref<string>("");
const searchTitle = t(`tools.common.search`);
// const searchBy = [
//   "no",
//   "status",
//   "tags",
//   "docxNumber",
//   "docxRevision",
//   "docxReference",
//   "registerer",
// ];

const tKPIPath = `tools.change.tabs.dcr.kpi`;

const manager = new DocumentChangeManager();

const entities = ref<DocumentChangeTypes.TDocumentChange[]>([]);
watchEffect(async () => {
  if (route.params.tab === "dcr" || useDCRStore().getSignal) entities.value = await manager.get();
});

const userInfo = useUserStore().info();
if (!userInfo) {
  router.push({ path: "/" });
  throw new Error(`User evaluates to false.`);
}
const simpleUser = new SimpleUser().build(userInfo);

const applyManipulation = (
  entities: DocumentChangeTypes.TDocumentChange[]
): DocumentChangeTypes.TDocumentChange[] => {
  let manipulated = entities;

  if (onlyMyActions) {
    manipulated = manipulated.filter((item) => {
      const normalizedName = simpleUser.getNormalizedUsername();
      return (
        item.checker === normalizedName ||
        item.approver === normalizedName ||
        item.registerer === normalizedName
      );
    });
  }

  if (departments.value.length) {
    const checkIfInDepartment = (
      item: DocumentChangeTypes.TDocumentChange,
      users: IUserEntity[],
      departments: string[]
    ): boolean => {
      const findUserDepartment = (user: string): string => {
        return (
          users.find((item) => item.username === user.replace(" ", ".").toLocaleLowerCase())?.info
            .department ?? ""
        );
      };
      if (
        (item.checker && departments.includes(findUserDepartment(item.checker))) ||
        (item.approver && departments.includes(findUserDepartment(item.approver))) ||
        (item.registerer && departments.includes(findUserDepartment(item.registerer)))
      ) {
        return true;
      } else return false;
    };
    manipulated = manipulated.filter((item: DocumentChangeTypes.TDocumentChange) =>
      checkIfInDepartment(item, tableUsers.value, departments.value)
    );
  }

  return manipulated;
};

const manipulatedEntities = computed(() => {
  return applyManipulation(entities.value);
});

const tableEntities: ComputedRef<RoleAction[]> = computed(() => {
  let index = 0;
  return manipulatedEntities.value.flatMap((record: DocumentChangeTypes.TDocumentChange) => {
    const timeline: DocumentChangeTypes.Processing.TTimeline = JSON.parse(record.timeline);
    const roleRecords: RoleAction[] = [];

    /**
     * Find the index of the last 'Rejected' status
     */
    const lastRejectedIndex: number | -1 = timeline
      .map((item) => item.status)
      .lastIndexOf("Rejected");
    /**
     * Retrieval of last status 'Complete' or last after status 'Rejected' ITimelineElement
     *
     * Find the last 'Complete' status after 'Rejected' or in the entire timeline.
     *
     */
    const checkerActionAvailableTime: DocumentChangeTypes.Processing.ITimelineElement | undefined =
      lastRejectedIndex !== -1
        ? timeline
            .slice(lastRejectedIndex + 1)
            .reverse()
            .find((item) => item.status === "Complete")
        : timeline
            .slice()
            .reverse()
            .find((item) => item.status === "Complete");

    /**
     * 'undefined' value of checkerActionAvailableTime means that dcr is not ready for review
     * and for this dcr empty array of review analysis is returned.
     */
    if (checkerActionAvailableTime === undefined) return roleRecords;

    const sinceChecker = TimeHelper.convertToLocalTime(checkerActionAvailableTime.date);

    /**
     *
     */
    const reviewerRecords = [
      new RoleAction(index, "Checker", record, sinceChecker),
      new RoleAction(index, "Approver", record),
      new RoleAction(index, "Registerer", record),
    ];

    reviewerRecords.forEach((record) => {
      if (record.isValid()) roleRecords.push(record);
    });

    return roleRecords;
  });
});

// legend
const priorities: DocumentChangeTypes.TPriority[] = ["low", "medium", "high"];
const stages: Record<string, [number, [number, number], number]> = {
  low: [7, [7, 14], 14],
  medium: [3, [3, 7], 7],
  high: [1, [1, 3], 3],
};

// view
const listVariant = ref<"numbered" | "group">("numbered");
const group = ref<"no" | "username" | "role" | "hasTaken" | "priority" | undefined>(undefined);
// const groupOrder = ref<"asc" | "desc">("asc");
const getGroupingText = (valueOfKey: any) => {
  switch (group.value) {
    case "hasTaken":
      return valueOfKey ? "Taken" : "Not Taken";

    default:
      return valueOfKey;
  }
};
type SortItem = { key: string; order?: boolean | "asc" | "desc" };
const groupBy: ComputedRef<SortItem[] | undefined> = computed<SortItem[] | undefined>(() => {
  if (group.value === undefined) return undefined;
  else
    return [
      {
        key: group.value,
        // order: groupOrder.value,
      },
    ];
});
const changeList: Function = (variant: "numbered" | "group"): void => {
  if (variant === "numbered") group.value = undefined;
  listVariant.value = variant;
};

// filters

// switch
const onlyMyActions = ref<boolean>(false);
// autocomplete
const tableUsers = ref<IUserEntity[]>([]);
const filDepartments = ref<string[]>([]);
const departments = ref<string[]>([]);

watch(
  tableEntities,
  async (newTableEntities) => {
    const userManager: UserManager = new UserManager();
    const allUsers: IUserEntity[] = await userManager.get();
    const tableUsernames: string[] = newTableEntities.map((en) => en.username);

    tableUsers.value = allUsers.filter((user) =>
      tableUsernames.includes(new SimpleUser().build(user).getNormalizedUsername())
    );

    const departmentsManager: DepartmentsManager = new DepartmentsManager();
    const departmentEntities: IChip[] = await departmentsManager.get();
    const departmentNames: string[] = departmentEntities.map((en) => en.name);

    const filteredDepartments: string[] = departmentNames.filter((department) =>
      tableUsers.value.some((user) => user.info.department === department)
    );

    filDepartments.value = filteredDepartments;
  },
  { immediate: true }
);
</script>

<template>
  <v-card class="rounded-xl elevation-2 position-relative">
    <v-card class="position-absolute top-0 right-0 elevation-0 bg-surface-2">
      <v-card-text class="pa-2 ma-2 border rounded-xl">
        <div class="text-body-2 ms-2">{{ $t(`${tKPIPath}.legend.title`) }}</div>
        <template v-for="priority in priorities">
          <div class="d-flex">
            <div class="text-caption font-weight-medium ms-2">
              {{ $t(`${tKPIPath}.legend.priority`, { priority }) }}
            </div>
            <v-badge
              v-for="(stage, index) in stages[priority]"
              class="ms-2"
              inline
              dot
              :color="
            RoleAction.priorityColor(priority, Array.isArray(stage) ? stage.at(0)! + 1 : index === 0 ? stage - 1 : stage)
          "
            >
              <span class="text-caption me-1" v-if="index === 0">{{
                `${$t(`${tKPIPath}.legend.days`)} < ${stage}`
              }}</span>
              <span class="text-caption me-1" v-if="Array.isArray(stage) && index === 1">{{
                `${$t(`${tKPIPath}.legend.days`)} ${stage.at(0)}-${stage.at(1)}`
              }}</span>
              <span class="text-caption me-1" v-if="index === 2">{{
                `${$t(`${tKPIPath}.legend.days`)} > ${stage}`
              }}</span>
            </v-badge>
          </div>
        </template>
      </v-card-text>
    </v-card>
    <v-card-text>
      <div class="subheading">{{ $t(`${tKPIPath}.view.title`) }}</div>
      <v-btn
        class="ma-2"
        icon="mdi-format-list-numbered"
        :variant="listVariant === 'numbered' ? 'tonal' : 'text'"
        :color="listVariant === 'numbered' ? 'secondary' : ''"
        @click="() => changeList('numbered')"
      >
      </v-btn>
      <v-btn
        class="ma-2"
        icon="mdi-format-list-group"
        :variant="listVariant === 'group' ? 'tonal' : 'text'"
        :color="listVariant === 'group' ? 'secondary' : ''"
        @click="() => changeList('group')"
      >
      </v-btn>
      <template v-if="listVariant === 'group'">
        <div class="text-caption ms-4">{{ $t(`${tKPIPath}.view.groupBy`) }}</div>
        <v-chip-group class="ms-4" filter v-model="group" selected-class="bg-secondary"
          ><v-chip value="no" variant="text">{{ $t(`${tKPIPath}.view.group.no`) }}</v-chip>
          <v-chip value="username" variant="text">{{
            $t(`${tKPIPath}.view.group.username`)
          }}</v-chip>
          <v-chip value="role" variant="text">{{ $t(`${tKPIPath}.view.group.role`) }}</v-chip>
          <v-chip value="hasTaken" variant="text">{{ $t(`${tKPIPath}.view.group.taken`) }}</v-chip>
          <v-chip value="priority" variant="text">{{
            $t(`${tKPIPath}.view.group.priority`)
          }}</v-chip>
        </v-chip-group>
      </template>

      <div class="subheading">{{ $t(`${tKPIPath}.filters.title`) }}</div>
      <v-switch
        v-model="onlyMyActions"
        hide-details
        :label="$t(`${tKPIPath}.filters.myActions`)"
        color="secondary"
      ></v-switch>
      <v-autocomplete
        v-model="departments"
        clearable
        :label="$t(`${tKPIPath}.filters.departments`)"
        :items="filDepartments"
        multiple
      ></v-autocomplete>
    </v-card-text>
    <v-data-table
      :headers="tableHeaders"
      :items="tableEntities"
      :group-by="groupBy"
      :search="tableSearch"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 15, title: '15' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      class="bg-surface-2"
    >
      <template v-slot:top>
        <v-toolbar flat density="compact" class="bg-surface-2 pa-n4">
          <v-toolbar-title class="bg-surface-2 ml-0">
            {{ smallScreen ? "" : toolbarTitle }}
          </v-toolbar-title>

          <v-text-field
            v-model="tableSearch"
            :label="searchTitle"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            single-line
            :rounded="true"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:group-header="{ item, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="tableHeaders.length">
            <v-btn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              size="small"
              variant="text"
              @click="toggleGroup(item)"
            ></v-btn>
            {{ getGroupingText(item.value) }}
          </td>
        </tr>
      </template>

      <template v-slot:item.since="{ value }">
        {{ TimeHelper.removeTimezone(value) }}
      </template>
      <template v-slot:item.taken="{ value }">
        {{ TimeHelper.removeTimezone(value) }}
      </template>
      <template v-slot:item.elapsed="{ item, value }">
        <v-chip :color="RoleAction.priorityColor(item.priority, value)">
          {{ `${value} ${value !== 1 ? "Days" : "Day"}` }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>
