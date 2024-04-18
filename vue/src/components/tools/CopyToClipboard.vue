<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Clip {
  [key: string]: any;
}

const props = defineProps<{
  filtered: Clip;
}>();

const filtered = ref<Clip>(props.filtered);

watchEffect(() => {
  filtered.value = props.filtered;
});

// copy to clipboard

const convertToExcelFormat = (data: Array<Clip>): string => {
  // Generate headers
  const headers = Object.keys(data[0]).join("\t") + "\n";

  // Generate rows
  const rows = data
    .map((obj) => {
      return Object.values(obj)
        .map((value) => {
          // Escape tabs and line breaks
          if (typeof value === "string") {
            return value.replace(/[\t\n]/g, " ");
          }
          return value;
        })
        .join("\t");
    })
    .join("\n");

  // Combine headers and rows
  return headers + rows;
};

const unsecuredCopyToClipboard = (text: string): void => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
const copyToClipboard = (value: string, output: "excel"): void => {
  const parsedValue = JSON.parse(value);
  if (!Array.isArray(parsedValue))
    throw new Error("copyToClipboard function accepts only stringified Array objects.");

  let returnCallback;
  switch (output) {
    case "excel":
      returnCallback = () => convertToExcelFormat(parsedValue);
      break;

    default:
      break;
  }

  if (!returnCallback)
    throw new Error(
      "Output of copyToClipboard function is undefined, please provide correct output type."
    );

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(returnCallback());
  } else {
    unsecuredCopyToClipboard(returnCallback());
  }
};
</script>

<template>
  <v-tooltip text="Copy results to clipboard.">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="text"
        icon="mdi-content-copy"
        color="primary"
        class="rounded-xl ml-4"
        v-bind="props"
        @click="() => copyToClipboard(JSON.stringify(filtered), 'excel')"
      />
    </template>
  </v-tooltip>
</template>
