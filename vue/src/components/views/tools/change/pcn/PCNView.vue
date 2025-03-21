<script setup lang="ts">
import { IProcessChangeRequest } from "../../../../../interfaces/change/IProcessChangeRequest";
import { nodeConfig } from "../../../../../config/env";
import { PDFHelper } from "../../../../../models/common/files/PDFHelper";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PCNAcceptOrReject from "./PCNAcceptOrReject.vue";
// import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { ProcessChangeNoticeManager } from "../../../../../models/change/pcn/ProcessChangeNoticeManager";
import { useEditorStore } from "../../../../../stores/editorStore";
import { IProcessChangeNoticeUpdates } from "../../../../../interfaces/change/IProcessChangeNoticeUpdates";
import { IProcessChangeNotice } from "../../../../../interfaces/change/IProcessChangeNotice";
// import { v4 as uuidv4 } from "uuid";

const emit = defineEmits(["loadItems"]);

const smallScreen = ref<boolean>(window.innerWidth < 960);

const props = defineProps<{
  item: IProcessChangeRequest;
  tab: string;
}>();

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/common/`;
const logoSource = `${backend}reconext-logo.png`;

const manager = new ProcessChangeNoticeManager();
const item = ref<IProcessChangeRequest>(props.item);

const tab = ref<string>(props.tab);
watch(
  () => props.tab,

  async (newT, oldT) => {
    tab.value = newT;
    if (newT === "pcn" && oldT !== "pcn") item.value = await manager.getNotice(props.item.id);
  }
);

const updates = ref<Array<IProcessChangeNoticeUpdates>>([]);

const route = useRoute();

const openDialog = ref<boolean>(false);

watch(
  () => route,
  async (newRoute) => {
    if (
      tab.value === "pcn" &&
      newRoute &&
      parseInt(route.params.no as string) === (props.item.processChangeNotice?.id as number)
    ) {
      openDialog.value = true;
    }
  },
  { deep: true, immediate: true }
);

const showAOR = ref<boolean>(true);

const checkActions = ref<true | null>(null);
const handleResetActions = () => (checkActions.value = null);

watch(openDialog, async (newOpenDialog, oldOpenDialog) => {
  try {
    if (oldOpenDialog !== true && newOpenDialog !== false) {
      if (tab.value === "pcn") {
        item.value = await manager.getNotice(props.item.id);
        showAOR.value = true;
        checkActions.value = true;
      }
    } else if (oldOpenDialog === true && newOpenDialog === false) {
      if (tab.value === "pcn") router.push({ path: `/tool/change/browse/pcn` });
    }
  } catch (error) {
    console.error(`watch openDialog ${error}`);
  }
});

// to format

const formatReasonAndDescription = (value: string | undefined | null) => {
  try {
    if (!value) return "";

    // const changeReasonDefault = `<p><span style="color:hsl(0, 0%, 60%);">Change Reason</span></p>`;
    // const changeDescriptionDefault = `<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>`;

    const editorStore = useEditorStore();

    const changeReasonDefault: string = editorStore.getDefault("change-reason");
    const changeDescriptionDefault: string = editorStore.getDefault("change-description");

    if (value === changeReasonDefault || value === changeDescriptionDefault) return "";

    return value;
  } catch (error) {
    console.error(`formatReasonAndDescription ${error}`);
  }
};

const formatBooleans = (value: boolean | undefined | null) => {
  try {
    if (typeof value !== "boolean") return "";
    return value === true ? "Yes" : "No";
  } catch (error) {
    console.error(`formatBooleans ${error}`);
  }
};

const isJSON = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};

const formatLists = (value: string | undefined | null) => {
  try {
    if (!value) return "";

    if (isJSON(value)) {
      const val = JSON.parse(value);
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
        return val.join(", ");
      }
    } else {
      return "";
    }
  } catch (error) {
    console.error(`formatLists ${error}`);
  }
};

const formatUser = (username: string | null | undefined) => {
  try {
    if (!username) return "";
    if (!username.includes(".")) return username;

    const [firstName, lastName] = username.split(".");
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return `${formattedFirstName} ${formattedLastName}`;
  } catch (error) {
    console.error(`formatUser ${error}`);
  }
};

const custom = computed(() => {
  let notice: IProcessChangeNotice | null;
  try {
    notice = item.value.processChangeNotice;
    return {
      requestedBy: formatUser(item.value.requestedBy),
      changeReason: formatReasonAndDescription(item.value.changeReason),
      changeDescription: formatReasonAndDescription(notice?.changeDescription),
      areDocumentationChangesRequired: formatBooleans(notice?.areDocumentationChangesRequired),
      isNewDocumentationRequired: formatBooleans(notice?.isNewDocumentationRequired),
      listOfDocumentationToChange: formatLists(notice?.listOfDocumentationToChange),
      listOfDocumentationToCreate: formatLists(notice?.listOfDocumentationToCreate),
      engineeringDepartmentApprover: formatUser(notice?.engineeringDepartmentApproverUsername),
      qualityDepartmentApprover: formatUser(notice?.qualityDepartmentApproverUsername),
      dedicatedDepartmentApprover: formatUser(notice?.dedicatedDepartmentApproverUsername),
      personDesignatedForImplementation: formatUser(notice?.personDesignatedForImplementation),
    };
  } catch (error) {
    notice = item.value.processChangeNotice;
    throw new Error(
      `item.value.processChangeNotice evaluates to ${notice} at PCNView.. error: ${error}`
    );
  }
});

const getUpdates = async (item: IProcessChangeRequest) => {
  updates.value = (item.processChangeNotice?.id as number)
    ? await manager.getNoticeUpdates(item.processChangeNotice?.id as number)
    : [];
};

if (tab.value === "pcn") getUpdates(item.value);

watch(
  item,
  (newItem) => {
    if (tab.value === "pcn") getUpdates(newItem);
  },
  { deep: true }
);

const updateHistory = computed<
  Array<{
    col1: string;
    col2: string;
    col3: string;
  }>
>(() =>
  updates.value.map((update) => ({
    col1: update.updateBy,
    col2: update.updateDate,
    col3: update.updateDescription,
  }))
);

const request = computed(() => {
  return {
    base: [
      {
        col1: "Applicant",
        col2: item.value.reconextOwner,
        col3: "PCR Number",
        col4: item.value.numberOfRequest ?? "",
      },
      {
        col1: "Application Date",
        col2: item.value.closureDate ?? "",
        col3: "PCN Number",
        col4: item.value.processChangeNotice?.numberOfNotice ?? "",
      },
    ],
    details: [
      {
        col1: "NOTICE DETAILS",
      },
      {
        col1: "Model / Process Impacted",
        col2: item.value.modelOrProcessImpacted,
      },
      {
        col1: "Change Reason",
        col2: custom.value.changeReason,
      },
      {
        col1: "Change Description",
        col2: custom.value.changeDescription,
      },
      {
        col1: "Person Designated For Implementation",
        col2: custom.value.personDesignatedForImplementation,
      },
    ],
    documentation: [
      {
        col1: "DOCUMENTATION",
      },
      {
        col1: "Are Documentation Changes Required",
        col2: custom.value.areDocumentationChangesRequired,
        col3: "List Of Documents To Change",
        col4: custom.value.listOfDocumentationToChange,
      },
      {
        col1: "Is New Documentation Required",
        col2: custom.value.isNewDocumentationRequired,
        col3: "List Of Documents To Create",
        col4: custom.value.listOfDocumentationToCreate,
      },
    ],
    approvals: [
      {
        col1: "APPROVALS",
      },
      {
        col1: "Engineering Department Approver",
        col2: custom.value.engineeringDepartmentApprover,
        col3: "Date",
        col4: item.value.processChangeNotice?.engineeringDepartmentApprovalDate ?? "",
      },
      {
        col1: "Quality Department Approver",
        col2: custom.value.qualityDepartmentApprover,
        col3: "Date",
        col4: item.value.processChangeNotice?.qualityDepartmentApprovalDate ?? "",
      },
      {
        col1: "Dedicated Department Approver",
        col2: custom.value.dedicatedDepartmentApprover ?? "",
        col3: "Date",
        col4: item.value.processChangeNotice?.dedicatedDepartmentApprovalDate ?? "",
      },
    ],
    history: [
      {
        col1: "UPDATE HISTORY",
      },
      {
        col1: "Update By",
        col2: "Date",
        col3: "Description",
      },
    ],
  };
});

const router = useRouter();

const handleClose = (closeData: { closed: IProcessChangeNotice }) => {
  try {
    if (tab.value === "pcn") {
      // emit("responseStatus", closeData.response);
      emit("loadItems");

      item.value.processChangeNotice = closeData.closed;

      router.push({ path: `/tool/change/browse/pcn` });
      openDialog.value = false;

      showAOR.value = false;
    }
  } catch (error) {
    console.error(`handleClose pcn ${error}`);
  }
};

const open = () => {
  try {
    if (tab.value === "pcn") {
      router.push({
        path: `/tool/change/browse/pcn/${props.item.processChangeNotice?.id as number}`,
      });
      openDialog.value = true;
    }
  } catch (error) {
    console.error(`open pcn ${error}`);
  }
};
</script>

<template>
  <v-dialog v-model="openDialog" :max-width="smallScreen ? '90vw' : '60vw'" max-height="80vh">
    <template v-slot:activator>
      <v-tooltip text="View/Approve PCN">
        <template v-slot:activator="{ props: tooltip }">
          <!-- :id="item.value.numberOfRequest" -->
          <v-btn
            color="primary"
            variant="tonal"
            class="rounded-lg"
            :size="56"
            v-bind="{ ...tooltip }"
            @click="open"
          >
            <v-icon icon="mdi-file-find" :size="24" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card color="primary" variant="outlined" class="bg-background rounded-xl">
        <v-card-title :class="smallScreen ? 'px-4' : 'px-10'">
          <span class="text-h5">PCN</span>
        </v-card-title>
        <v-card-text
          class="d-flex justify-center align-center"
          :class="smallScreen ? 'px-2' : 'px-10'"
        >
          <v-sheet id="pcn">
            <v-container fluid>
              <v-row
                class="align-items-center border-s-md border-e-md border-t-md overflow-hidden"
                style="height: 56px"
                justify="space-between"
              >
                <v-col class="text-h6">
                  <div class="text-no-wrap" style="height: 32px">PROCESS CHANGE NOTICE</div>
                </v-col>
                <v-col class="flex-grow-0">
                  <v-img :src="logoSource" height="32px" width="144px"></v-img>
                </v-col>
              </v-row>
              <v-row v-for="row in request.base" class="border-s-md border-e-md border-t-md">
                <template v-for="(col, colKey) in row">
                  <v-col
                    cols="3"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    v-html="col"
                    :style="
                      colKey === 'col1' || colKey === 'col3' ? 'background-color: #e9e7e7' : ''
                    "
                  />
                </template>
              </v-row>
              <v-row
                v-for="(row, rowIndex) in request.details"
                class="border-s-md border-e-md border-t-md"
                :id="rowIndex === 3 ? 'description' : rowIndex === 2 ? 'reason' : ''"
              >
                <template v-for="(col, colKey) in row">
                  <v-col
                    v-if="rowIndex === 0"
                    cols="12"
                    class="text-subtitle-1 text-center"
                    v-html="col"
                  />
                  <v-col
                    v-else
                    :cols="colKey === 'col1' ? 3 : 9"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    :style="colKey === 'col1' ? 'background-color: #e9e7e7' : ''"
                    v-html="col"
                  />
                </template>
              </v-row>
              <v-row
                v-for="(row, rowIndex) in request.documentation"
                class="border-s-md border-e-md border-t-md"
              >
                <template v-for="(col, colKey) in row">
                  <v-col
                    v-if="rowIndex === 0"
                    cols="12"
                    class="text-subtitle-1 text-center"
                    v-html="col"
                  />
                  <v-col
                    v-else
                    cols="3"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    :style="
                      colKey === 'col1' || colKey === 'col3' ? 'background-color: #e9e7e7' : ''
                    "
                    v-html="col"
                  />
                </template>
              </v-row>
              <v-row
                v-for="(row, rowIndex) in request.approvals"
                class="border-s-md border-e-md border-t-md"
                :class="
                  rowIndex === request.approvals.length - 1 &&
                  updateHistory.length === 0 &&
                  !item.processChangeNotice?.isCustomerApprovalRequired
                    ? 'border-b-md'
                    : ''
                "
              >
                <template v-for="(col, colKey) in row">
                  <v-col
                    v-if="rowIndex === 0"
                    cols="12"
                    class="text-subtitle-1 text-center"
                    v-html="col"
                  />
                  <v-col
                    v-else
                    cols="3"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    :style="
                      colKey === 'col1' || colKey === 'col3' ? 'background-color: #e9e7e7' : ''
                    "
                    v-html="col"
                  />
                </template>
              </v-row>
              <v-row
                v-if="item.processChangeNotice?.isCustomerApprovalRequired"
                class="border-s-md border-e-md border-t-md"
                :class="updateHistory.length === 0 ? 'border-b-md' : ''"
                ><v-col
                  cols="3"
                  class="text-body-2"
                  style="background-color: #e9e7e7"
                  v-html="'Customer Approver'"
                />
                <v-col cols="3" class="text-body-2 border-s-md" />
                <v-col
                  cols="3"
                  class="text-body-2 border-s-md"
                  style="background-color: #e9e7e7"
                  v-html="'Date and Signature'"
                />
                <v-col cols="3" class="text-body-2 border-s-md" />
              </v-row>

              <v-row
                v-if="updateHistory.length > 0"
                v-for="(row, rowIndex) in request.history"
                class="border-s-md border-e-md border-t-md"
              >
                <template v-for="(col, colKey) in row">
                  <v-col
                    v-if="rowIndex === 0"
                    cols="12"
                    class="text-subtitle-1 text-center"
                    v-html="col"
                  />
                  <v-col
                    v-else
                    :cols="colKey === 'col3' ? 6 : 3"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    style="background-color: #e9e7e7"
                    v-html="col"
                  />
                </template>
              </v-row>
              <v-row
                v-for="(row, rowIndex) in updateHistory"
                class="border-s-md border-e-md border-t-md"
                :class="rowIndex === updateHistory.length - 1 ? 'border-b-md' : ''"
              >
                <template v-for="(col, colKey) in row">
                  <v-col
                    :cols="colKey === 'col3' ? 6 : 3"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    v-html="col"
                  />
                </template>
              </v-row>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions :class="smallScreen ? 'px-4' : 'px-10'">
          <p-c-n-accept-or-reject
            v-if="showAOR"
            variant="reject"
            :pcrId="props.item.id"
            :pcnId="(props.item.processChangeNotice?.id as number)"
            @close="handleClose"
            :checkActions="checkActions"
            @resetActions="handleResetActions"
          ></p-c-n-accept-or-reject>

          <p-c-n-accept-or-reject
            v-if="showAOR"
            variant="accept"
            :pcrId="props.item.id"
            :pcnId="(props.item.processChangeNotice?.id as number)"
            @close="handleClose"
            :checkActions="checkActions"
            @resetActions="handleResetActions"
          ></p-c-n-accept-or-reject>

          <v-spacer></v-spacer>

          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            :text="smallScreen ? 'CLOSE' : 'CLOSE PREVIEW'"
            @click="isActive.value = false"
          />
          <!-- generate -->
          <v-btn
            class="bg-primary text-on-primary mr-4 rounded-xl"
            @click="
              PDFHelper.generatePDF('pcn', isActive, {
                padding: undefined,
                breakDeep: ['reason', 'description'],
              })
            "
            :text="smallScreen ? 'PDF' : 'GENERATE PDF'"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
