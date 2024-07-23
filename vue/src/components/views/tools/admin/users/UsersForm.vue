<script setup lang="ts">
import { ref, watch } from "vue";
import { UserInput } from "../../../../../models/admin/users/UserInput";
import { UserEntity } from "../../../../../models/user/UserEntity";
import { SimpleUser } from "../../../../../models/user/SimpleUser";

const emit = defineEmits(["save-data"]);

type IComponentProps = {
  editedItem: any;
  inputs: Promise<Array<UserInput>>;
};

const props = defineProps<{
  componentProps: IComponentProps;
}>();

const userEntity: UserEntity = props.componentProps.editedItem;
const user: SimpleUser = new SimpleUser().build(userEntity);
const inputs = ref<Array<UserInput>>([]);

(async (): Promise<void> => {
  inputs.value = await props.componentProps.inputs;

  if (inputs.value && inputs.value.length > 0) {
    const info = () => {
      const position: string = userEntity.info?.position || "";

      const department: string = userEntity.info?.department || "";

      const decisionMaker = ((): string => {
        const d: boolean = userEntity.info?.decisionMaker ?? false;
        if (d) return "Yes";
        else if (d === false) return "No";
        else return "";
      })();

      return { position, department, decisionMaker };
    };

    inputs.value[0].val = info().position;
    inputs.value[1].val = info().department;
    inputs.value[2].val = info().decisionMaker;
  }
})();

watch(
  inputs,
  (newInputValues) => {
    if (newInputValues.some((v) => !!v.val)) {
      emit("save-data", {
        user: user,
        item: userEntity,
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
