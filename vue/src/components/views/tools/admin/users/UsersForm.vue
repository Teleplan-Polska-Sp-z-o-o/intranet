<script setup lang="ts">
import { ref, watch } from "vue";
import { UserInput } from "../../../../../models/admin/users/UserInput";
import { IPermission } from "../../../../../interfaces/user/IPermission";

const emit = defineEmits(["save-data"]);

type IComponentProps = {
  editedItem: any;
  inputs: Promise<Array<UserInput>>;
};

const props = defineProps<{
  componentProps: IComponentProps;
}>();

const item = ref<any>(props.componentProps.editedItem);

const inputs = ref<Array<UserInput>>([]);

(async (): Promise<void> => {
  inputs.value = await props.componentProps.inputs;

  if (inputs.value && inputs.value.length > 0) {
    const permission = () => {
      const p: IPermission = item.value.permission;
      if (p.control) return "Admin";
      if (p.write) return "Moderator";
      else return "User";
    };

    const info = () => {
      const position: string = item.value.info?.position || "";

      const department: string = item.value.info?.department || "";

      const decisionMaker = ((): string => {
        const d: boolean = item.value.info?.decisionMaker;
        if (d) return "Yes";
        else if (d === false) return "No";
        else return "";
      })();

      return { position, department, decisionMaker };
    };

    inputs.value[0].val = permission();
    inputs.value[1].val = info().position;
    inputs.value[2].val = info().department;
    inputs.value[3].val = info().decisionMaker;
    inputs.value[4].val = item.value.permission.confidentiality;
  }
})();

watch(
  inputs,
  (newInputValues) => {
    if (newInputValues.some((v) => !!v.val)) {
      emit("save-data", {
        item: item.value,
        inputs: newInputValues,
      });
    }
  },
  { deep: true }
);
</script>

<template>
  <div v-for="input in inputs" :key="input.id">
    <v-select
      v-if="input.variant === 'select'"
      :clearable="true"
      v-model="input.val"
      :label="input.label"
      :items="input?.items"
    ></v-select>

    <v-text-field
      v-if="input.variant === 'text'"
      v-model="input.val"
      variant="underlined"
      :label="input.label"
    ></v-text-field>
  </div>
</template>
