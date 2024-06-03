<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Clip {
  [key: string]: any;
}

const props = defineProps<{
  filtered: Clip;
  copyHeadersOrder?: Array<string>;
  copyHeadersCustoms?: Function;
}>();

const filtered = ref<Clip>(props.filtered);

watchEffect(() => {
  filtered.value = props.filtered;
});

// copy to clipboard

// const convertToExcelFormat = (data: Array<Clip>): string => {
//   // Generate headers
//   const headers = Object.keys(data[0]).join("\t") + "\n";

//   // Generate rows
//   const rows = data
//     .map((obj) => {
//       return Object.values(obj)
//         .map((value) => {
//           // Escape tabs and line breaks
//           if (typeof value === "string") {
//             return value.replace(/[\t\n]/g, " ");
//           }
//           return value;
//         })
//         .join("\t");
//     })
//     .join("\n");

//   // Combine headers and rows
//   return headers + rows;
// };

const convertToExcelFormat = (data: Array<Clip>): string => {
  let headers: Array<string> | undefined = props.copyHeadersOrder;
  // Check if headers are provided
  if (!headers || headers.length === 0) {
    // If headers are not provided, generate headers from data keys
    headers = Object.keys(data[0] || {});
  }

  const getNestedProperty = (obj: object, path: string, hasOwnProperty: boolean = false): any => {
    // Split the path by dots
    const keys = path.split(".");

    // Iterate through the keys to get the nested property
    let current: any = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (current && typeof current === "object" && key in current) {
        if (hasOwnProperty && i === keys.length - 1) {
          // Check if the last key is an own property
          return Object.prototype.hasOwnProperty.call(current, key);
        }
        current = current[key];
      } else {
        // If any key in the path doesn't exist, return undefined
        return undefined;
      }
    }
    return current;
  };

  const checkProperty = (data: any, property: string): boolean => {
    const lastDotIndex = property.lastIndexOf(".");

    if (lastDotIndex !== -1) {
      // Split the string on the last dot
      const nestedObjectPath = property.substring(0, lastDotIndex);
      const nestedObjectHasOwnProperty = getNestedProperty(data, nestedObjectPath, true);

      // Check if the nested property exists on the base object
      return nestedObjectHasOwnProperty || false;
    } else {
      // Check the property directly on data
      return data.hasOwnProperty(property) || false;
    }
  };

  // Generate headers
  const headersToChange: Array<string> = [];
  const filteredHeaders = headers.filter((header) => {
    const split = header.split("=>");
    if (split.length === 2) {
      headersToChange.push(header);
      return checkProperty(data[0], split.at(0) as string);
    } else return checkProperty(data[0], header);
    //   return checkProperty(data[0], split.at(0) as string )  data[0]?.hasOwnProperty(split.at(0) as string);
    // } else return checkProperty(data[0], header ) data[0]?.hasOwnProperty(header);
  });

  const headersRow =
    (headersToChange.length > 0
      ? filteredHeaders.map((header) => {
          if (headersToChange.includes(header)) {
            return header.split("=>").at(1);
          } else return header;
        })
      : filteredHeaders
    ).join("\t") + "\n";

  const customValues = typeof props.copyHeadersCustoms === "function";
  // Generate rows
  const rows = data
    .map((obj) => {
      return filteredHeaders
        .map((header) => {
          let value = customValues
            ? props.copyHeadersCustoms(
                header.split("=>").at(0),
                header.includes(".")
                  ? getNestedProperty(obj, header.split("=>").at(0) as string)
                  : obj[header.split("=>").at(0) as string]
              )
            : "no-case";
          if (value === "no-case")
            value = header.includes(".")
              ? getNestedProperty(obj, header.split("=>").at(0) as string)
              : obj[header.split("=>").at(0) as string];

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
  return headersRow + rows;
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
