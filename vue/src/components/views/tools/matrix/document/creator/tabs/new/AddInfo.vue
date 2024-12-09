<script setup lang="ts">
import { onMounted, ref } from "vue";
import { DocumentTypes } from "../../../../../../../../interfaces/document/DocumentTypes";
import { Chips } from "../../../../../../../../models/document/Chips";
import { CompetenceManager } from "../../../../../../../../models/document/CompetenceManager";

// competences
const selectedCompetences = ref<Array<DocumentTypes.ICompetenceEntity>>([]);
const allCompetences = ref<Array<DocumentTypes.ICompetenceEntity>>([]);

onMounted(async () => {
  try {
    allCompetences.value = await new CompetenceManager().get(new Chips());
    console.log(allCompetences.value);
  } catch (error) {
    console.error("Failed to fetch competences:", error);
    allCompetences.value = [];
  }
});
</script>
<template>
  <v-text-field
    label="Product"
    variant="solo-filled"
    hint="Enter the name of the commodity or item."
    prepend-icon="mdi-text-short"
  ></v-text-field>

  <v-text-field
    label="Owner"
    variant="solo-filled"
    hint="Specify the person responsible for the process."
    prepend-icon="mdi-text-short"
  ></v-text-field>

  <v-date-input
    clearable
    label="Last Update"
    variant="solo-filled"
    hint="The date when this item was last updated."
  ></v-date-input>

  <v-text-field
    label="Author"
    variant="solo-filled"
    hint="The individual who made the last change."
    prepend-icon="mdi-text-short"
  ></v-text-field>

  <v-date-input
    clearable
    label="Created"
    variant="solo-filled"
    hint="The date this item was initially created."
  ></v-date-input>

  <v-combobox
    :items="allCompetences"
    item-title="name"
    item-value="id"
    multiple
    chips
    v-model="selectedCompetences"
    label="Training Codes"
    variant="solo-filled"
    hint="Add or select codes for related training competencies."
    prepend-icon="mdi-format-list-checks"
  ></v-combobox>
</template>
