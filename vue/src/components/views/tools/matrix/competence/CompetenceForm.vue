<script setup lang="ts">
import { computed, ComputedRef, ref, watchEffect } from "vue";
import { DocumentTypes } from "../../../../../interfaces/document/DocumentTypes";

const emit = defineEmits(["verified", "save-data"]);

const props = defineProps<{
  componentProps: any;
}>();

// table record from props
const competenceEntity: DocumentTypes.ICompetenceEntity = props.componentProps.editedItem;

const code = ref<string>(competenceEntity.code);
const position = ref<string>(competenceEntity.position);
const name = computed<string>(() => `${code.value} ${position.value}`);
const saveData: ComputedRef<DocumentTypes.ICompetenceEntity> = computed(() => {
  return {
    ...competenceEntity,
    code: code.value,
    position: position.value,
    name: name.value,
  };
});

watchEffect(() => {
  if (!!code.value && !!position.value && !!name.value) {
    emit("verified", false);
    emit("save-data", saveData.value);
  } else {
    emit("verified", true);
  }
});
</script>

<template>
  <v-text-field
    v-model="code"
    variant="underlined"
    clearable
    :label="$t(`tools.matrix.tabs.competences.form.code`)"
  ></v-text-field>
  <v-text-field
    v-model="position"
    variant="underlined"
    clearable
    :label="$t(`tools.matrix.tabs.competences.form.position`)"
  ></v-text-field>
  <v-text-field
    v-model="name"
    variant="underlined"
    readonly
    :label="$t(`tools.matrix.tabs.competences.form.name.label`)"
    :hint="$t(`tools.matrix.tabs.competences.form.name.hint`)"
    persistent-hint
  ></v-text-field>
</template>
