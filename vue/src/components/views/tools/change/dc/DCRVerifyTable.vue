<script setup lang="ts">
import { useEditorStore } from "../../../../../stores/editorStore";
import { DocumentChangeTypes } from "../../../../../interfaces/change/dcr/DocumentChangeTypes";
import { ICompetence, IFileItem } from "../../../../../interfaces/document/DocumentTypes";

const props = defineProps<{
  documentChangeFields: DocumentChangeTypes.IDocumentChangeFields;
  files: IFileItem[];
}>();

const camelCaseToTitleCase = (str: string) => {
  let titleCase = str.replace(/([A-Z])/g, " $1");
  titleCase = titleCase.charAt(0).toUpperCase() + titleCase.slice(1);
  return titleCase;
};

const testAffected = (value: unknown, key: string) => {
  if (typeof value === "string" && key === "affected") {
    const editorStore = useEditorStore();
    const affectedDefault: string = editorStore.getDefault("affected", true);
    if (value === affectedDefault) return false;
  }

  return true;
};

const formatValue = (value: unknown, key: string) => {
  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "number":
      return value.toString();

    case "string":
      if (key === "affectedCompetences") {
        return JSON.parse(value)
          .map((c: ICompetence) => c.name)
          .join(", ");
      }
      if (key === "fileNames") {
        if (value !== "[]") return JSON.parse(value).join(", ");
        else return props.files.map((file) => file.file?.at(0)?.name).join(", ");
      }

      return value;

    case "boolean":
      return value === true ? "Yes" : "No";

    default:
      throw new Error(
        "Value from documentChangeFields doesn't match any of switch type variants at DCRVerifyTable."
      );
  }
};

const disallowedKeys = ["dialog"];
</script>

<template>
  <v-sheet border class="rounded-xl mb-4">
    <template v-for="(value, key, index) in props.documentChangeFields" :key="key">
      <v-card
        v-if="value && testAffected(value, key as string) && !disallowedKeys.includes(key as string)"
        color="transparent"
        elevation="0"
        outlined="false"
        class="pa-2"
      >
        <v-card-subtitle>{{ camelCaseToTitleCase(key as string) }}</v-card-subtitle>
        <v-card-text v-html="formatValue(value, key as string)"></v-card-text>
      </v-card>
      <v-divider
        class="mx-4"
        v-if="value && !disallowedKeys.includes(key as string) && index !== Object.keys(props.documentChangeFields).length - 1"
      ></v-divider>
    </template>
  </v-sheet>
</template>
