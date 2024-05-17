<script setup lang="ts">
import { IProcessChangeRequest } from "../../../../../interfaces/change/IProcessChangeRequest";
import { nodeConfig } from "../../../../../config/env";
import { PDFHelper } from "../../../../../models/common/PDFHelper";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ProcessChangeRequestManager } from "../../../../../models/change/pcr/ProcessChangeRequestManager";
import { IProcessChangeRequestUpdates } from "../../../../../interfaces/change/IProcessChangeRequestUpdates";
import AcceptOrReject from "./AcceptOrReject.vue";
import { ResponseStatus } from "../../../../../models/common/ResponseStatus";
import { useEditorStore } from "../../../../../stores/editorStore";
import { UserManager } from "../../../../../models/user/UserManager";

const emit = defineEmits(["responseStatus", "loadItems"]);

const smallScreen = ref<boolean>(window.innerWidth < 960);

const props = defineProps<{
  item: IProcessChangeRequest;
}>();

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/common/`;
const logoSource = `${backend}reconext-logo.png`;

const itemId: number = props.item.id;
const manager = new ProcessChangeRequestManager();

const item = ref<IProcessChangeRequest>(props.item);

// const route = useRoute();
// const no = ref<string | undefined>((route.params.no as string) || undefined);

const openDialog = ref<boolean>(false);

// watchEffect(() => {
//   no.value = (route.params.no as string) || undefined;
//   openDialog.value = no.value ? parseInt(no.value) === item.value.id : false;
// });

const showAOR = ref<boolean>(true);

const checkActions = ref<true | null>(null);
const handleResetActions = () => (checkActions.value = null);

watch(openDialog, async (newOpenDialog, oldOpenDialog) => {
  if (oldOpenDialog !== true && newOpenDialog !== false) {
    item.value = await manager.getRequest(itemId);
    showAOR.value = true;
    checkActions.value = true;
  } else if (oldOpenDialog === true && newOpenDialog === false) {
    router.push({ path: `/tool/change/browse/pcr` });
  }
});

// to format
const formatRequestedBy = () => {
  if (!item.value) return "";
  const parts: Array<string> = item.value.requestedBy.split(".");
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
};

const formatReasonAndDescription = (value: string | undefined) => {
  if (!item.value) return "";

  // const changeReasonDefault = `<p><span style="color:hsl(0, 0%, 60%);">Change Reason</span></p>`;
  // const changeDescriptionDefault = `<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>`;

  const editorStore = useEditorStore();

  const changeReasonDefault: string = editorStore.getDefault("change-reason");
  const changeDescriptionDefault: string = editorStore.getDefault("change-description");

  if (value === changeReasonDefault || value === changeDescriptionDefault) return "";

  return value;
};

const getOwnerTitle = async (formattedUsername: string): Promise<string> => {
  const manager = new UserManager();
  const username = formattedUsername.toLowerCase().split(" ").join(".");
  const user = await manager.getOne(username);
  const position = user.info.position?.toLowerCase();
  const positionUpperCased = position ? position.charAt(0).toUpperCase() + position.slice(1) : "";
  return positionUpperCased;
};

const custom = computed(() => {
  return {
    requestedBy: formatRequestedBy(),
    changeReason: formatReasonAndDescription(item.value.changeReason),
    changeDescription: formatReasonAndDescription(item.value.changeDescription),
    ownerTitle: getOwnerTitle(item.value.reconextOwner),
  };
});

const ownerTitle = ref<string>('');
(async () => ownerTitle.value = await custom.value.ownerTitle)();

const updates = ref<Array<IProcessChangeRequestUpdates>>([]);

const getUpdates = async () => {
  updates.value = item.value.id ? await manager.getRequestUpdates(item.value.id) : [];
};

getUpdates();

watch(
  item,
  () => {
    getUpdates();
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
        col1: "Program / Project",
        col2: item.value.program,
        col3: "PCR Number",
        col4: item.value.numberOfRequest,
      },
      {
        col1: "Dedicated Department for Implementation",
        col2: item.value.dedicatedDepartment,
        col3: "PCN Number",
        col4: item.value.processChangeNotice?.numberOfNotice,
      },
      {
        col1: "Internal / External",
        col2: item.value.internalOrExternal,
        col3: "Request Date",
        col4: item.value.requestDate,
      },
      {
        col1: "Request By",
        col2: custom.value.requestedBy,
        col3: "Needed Date",
        col4: item.value.dateNeeded,
      },
      {
        col1: "Customer Contact Person",
        col2: item.value.customerContactPerson,
        col3: "Closure Date",
        col4: item.value.closureDate,
      },
      {
        col1: "Reconext Contact Person",
        col2: item.value.reconextContactPerson,
        col3: "Reconext Owner",
        col4: item.value.reconextOwner,
      },
    ],
    details: [
      {
        col1: "REQUEST DETAILS",
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
        col1: "Impacts",
        col2: item.value.impacts,
      },
      {
        col1: "Cost of Implementation",
        col2: item.value.costOfImplementation,
      },
    ],
    risk: [
      {
        col1: "RISK & ASSESSMENT",
      },
      {
        col1: "Risk Analysis",
        col2: item.value.riskAnalysis,
      },
      {
        col1: "Implementation / Rejection",
        col2: item.value.assessment,
      },
    ],
    approvals: [
      {
        col1: "APPROVALS",
      },
      {
        col1: "Customer Approver",
        col2: "",
        col3: "Reconext Approver",
        col4: item.value.assessment === "Implementation" ? item.value.reconextOwner : "",
      },
      {
        col1: "Title",
        col2: "",
        col3: "Title",
        col4: ownerTitle.value,
      },
      {
        col1: "Date",
        col2: "",
        col3: "Date",
        col4: item.value.assessment === "Implementation" ? item.value.closureDate : "",
      },
      {
        col1: "Signature",
        col2: "",
        col3: "Signature",
        col4: "",
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

const handleClose = (closeData: { response: ResponseStatus; closed: IProcessChangeRequest }) => {
  emit("responseStatus", closeData.response);
  emit("loadItems");

  item.value = closeData.closed;

  router.push({ path: `/tool/change/browse/pcr` });
  openDialog.value = false;

  showAOR.value = false;
};

const open = () => {
  router.push({ path: `/tool/change/browse/pcr/${item.value.id}` });
  openDialog.value = true;
};
</script>

<template>
  <v-dialog v-model="openDialog" :max-width="smallScreen ? '90vw' : '60vw'" max-height="80vh">
    <template v-slot:activator>
      <v-tooltip text="View PCR">
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
            <v-icon icon="mdi-file-pdf-box" :size="24" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card color="primary" variant="outlined" class="bg-background rounded-xl">
        <v-card-title :class="smallScreen ? 'px-4' : 'px-10'">
          <span class="text-h5">PCR</span>
        </v-card-title>
        <v-card-text
          class="d-flex justify-center align-center"
          :class="smallScreen ? 'px-2' : 'px-10'"
        >
          <!-- width="595pt" height="842pt" -->
          <v-sheet id="pcr" width="595pt">
            <v-container fluid>
              <v-row
                class="align-items-center border-s-md border-e-md border-t-md overflow-hidden"
                style="height: 56px"
                justify="space-between"
              >
                <v-col class="text-h6">
                  <div class="text-no-wrap" style="height: 32px">PROCESS CHANGE REQUEST</div>
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
                v-for="(row, rowIndex) in request.risk"
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
                    :cols="colKey === 'col1' ? 3 : 9"
                    class="text-body-2"
                    :class="colKey !== 'col1' ? 'border-s-md' : ''"
                    :style="colKey === 'col1' ? 'background-color: #e9e7e7' : ''"
                    v-html="col"
                  />
                </template>
              </v-row>
              <v-row
                v-for="(row, rowIndex) in request.approvals"
                class="border-s-md border-e-md border-t-md"
                :class="
                  rowIndex === request.approvals.length - 1 && updateHistory.length === 0
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
          <accept-or-reject
            v-if="showAOR"
            variant="reject"
            :pcrId="itemId"
            @close="handleClose"
            :checkActions="checkActions"
            @resetActions="handleResetActions"
          ></accept-or-reject>

          <accept-or-reject
            v-if="showAOR"
            variant="accept"
            :pcrId="itemId"
            @close="handleClose"
            :checkActions="checkActions"
            @resetActions="handleResetActions"
          ></accept-or-reject>

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
            @click="PDFHelper.generatePDF('pcr', isActive)"
            :text="smallScreen ? 'PDF' : 'GENERATE PDF'"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
