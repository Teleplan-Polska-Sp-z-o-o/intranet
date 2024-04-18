<script setup lang="ts">
import { IProcessChangeRequest } from "../../../../../interfaces/change/IProcessChangeRequest";
import { nodeConfig } from "../../../../../config/env";
import { PDFHelper } from "../../../../../models/common/PDFHelper";

// https://phppot.com/javascript/jspdf-html-example/

const props = defineProps<{
  item: IProcessChangeRequest;
}>();

const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/common/`;
const logoSource = `${backend}reconext-logo.png`;

const item = props.item;

// to format
const formatRequestedBy = () => {
  const parts: Array<string> = item.requestedBy.split(".");
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
};
const custom = {
  requestedBy: formatRequestedBy(),
};

const request = {
  base: [
    {
      col1: "Program / Project",
      col2: item.program,
      col3: "Request Number",
      col4: item.numberOfRequest,
    },
    {
      col1: "Internal / External",
      col2: item.internalOrExternal,
      col3: "Request Date",
      col4: item.requestDate,
    },
    {
      col1: "Request By",
      col2: custom.requestedBy,
      col3: "Needed Date",
      col4: item.dateNeeded,
    },
    {
      col1: "Customer Contact Person",
      col2: item.customerContactPerson,
      col3: "Closure Date",
      col4: item.closureDate,
    },
    {
      col1: "Reconext Contact Person",
      col2: item.reconextContactPerson,
      col3: "Reconext Owner",
      col4: item.reconextOwner,
    },
  ],
  details: [
    {
      col1: "REQUEST DETAILS",
    },
    {
      col1: "Model / Process Impacted",
      col2: "",
    },
    {
      col1: "Change Description",
      col2: "",
    },
    {
      col1: "Change Reason",
      col2: "",
    },
  ],
  impacts: [
    {
      col1: "IMPACTS",
      col2: "",
    },
  ],
  cost: [
    {
      col1: "COST OF IMPLEMENTATION",
      col2: "",
    },
  ],
  risk: [
    {
      col1: "RISK & ASSESSMENT",
    },
    {
      col1: "Risk Analysis",
    },
    {
      col1: "Implementation / Rejection",
      col2: "",
    },
  ],
};
</script>

<template>
  <v-dialog max-width="60vw" max-height="80vh">
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip text="View PCR">
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            color="primary"
            variant="tonal"
            class="rounded-lg"
            :size="56"
            v-bind="{ ...activatorProps, ...tooltip }"
          >
            <v-icon icon="mdi-file-pdf-box" :size="24" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card color="primary" variant="outlined" class="bg-background rounded-xl">
        <v-card-title class="px-10">
          <span class="text-h5">PCR</span>
        </v-card-title>
        <v-card-text class="d-flex justify-center align-center">
          <!-- height="842pt" -->
          <v-sheet id="pcr" width="595pt">
            <v-container fluid>
              <v-row class="border">
                <v-col cols="9" class="text-h6 text-justify text-center">
                  PROCESS CHANGE REQUEST
                </v-col>
                <v-col cols="3"><v-img :src="logoSource"></v-img></v-col>
              </v-row>
              <v-row v-for="row in request.base">
                <v-col cols="3" class="text-body-2 border text-no-wrap" v-for="col in row">
                  {{ col }}
                </v-col>
              </v-row>
              <v-row v-for="(row, rowIndex) in request.details">
                <template v-for="(col, colKey) in row">
                  <v-col v-if="rowIndex === 0" cols="12" class="text-subtitle-1 border text-center">
                    {{ col }}
                  </v-col>
                  <v-col
                    v-else
                    :cols="colKey === 'col1' ? 3 : 9"
                    class="text-body-2 border text-no-wrap"
                  >
                    {{ col }}
                  </v-col>
                </template>
              </v-row>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            class="rounded-xl"
            color="primary"
            variant="text"
            text="CLOSE PREVIEW"
            @click="isActive.value = false"
          />
          <!-- generate -->
          <v-btn
            class="bg-primary text-on-primary mr-4 rounded-xl"
            @click="PDFHelper.generatePDF('pcr', isActive)"
            text="GENERATE PCR FROM PREVIEW"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
