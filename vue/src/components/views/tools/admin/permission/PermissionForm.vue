<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, watch, watchEffect } from "vue";
import {
  TPermissionGroup,
  IPermissionGroups,
  StaticGroups,
  TConfidentiality,
  UserGroup,
  TPermissionSubgroup,
  TPermissionSubgroupArray,
} from "../../../../../interfaces/user/UserTypes";
import { UserEntity } from "../../../../../models/user/UserEntity";
import { SimpleUser } from "../../../../../models/user/SimpleUser";

const emit = defineEmits(["save-data"]);

const props = defineProps<{
  componentProps: any;
}>();

// table record from props
const userEntity: UserEntity = props.componentProps.editedItem;
const user: SimpleUser = new SimpleUser().build(userEntity);

const userPermission: {
  read: boolean;
  write: boolean;
  control: boolean;
  confidentiality: TConfidentiality;
  groups: Array<UserGroup>;
  id: number;
} = userEntity.permission;

const adminGroupObject: IPermissionGroups = StaticGroups.getAdminGroups();

const groups: ComputedRef<Array<TPermissionGroup>> = computed<Array<TPermissionGroup>>(
  () => Object.keys(adminGroupObject) as Array<TPermissionGroup>
);

// models
const userConfidentialityItems: Array<TConfidentiality> = ["public", "restricted", "secret"];
const userConfidentiality: Ref<TConfidentiality> = ref<TConfidentiality>(
  userPermission.confidentiality
);
const userGroups: Ref<Array<TPermissionGroup>> = ref<Array<TPermissionGroup>>(
  userPermission.groups.map((group) => group.name)
);

const formatGroups = (groups: UserGroup[]): Partial<IPermissionGroups> => {
  return groups.reduce<Partial<IPermissionGroups>>((acc, group) => {
    acc[group.name] = group.subgroups.map((subGroup) => subGroup.name) as any;
    return acc;
  }, {});
};
const userPermissionGroupsObject: Ref<Partial<IPermissionGroups>> = ref<Partial<IPermissionGroups>>(
  formatGroups(userPermission.groups)
);

watch(
  () => userGroups,
  (newUserGroups) => {
    const filterObjectKeys = (
      obj: Ref<Partial<IPermissionGroups>>,
      allKeys: Array<TPermissionGroup>,
      requiredKeys: Array<TPermissionGroup>
    ): void => {
      allKeys.forEach((key) => {
        if (!requiredKeys.includes(key)) {
          delete obj.value[key];
        }
      });
      userPermissionGroupsObject.value = obj.value;
    };
    filterObjectKeys(userPermissionGroupsObject, groups.value, newUserGroups.value);
  },
  { deep: true }
);

const getSubGroupModelValue = (group: TPermissionGroup): TPermissionSubgroupArray => {
  if (!userPermissionGroupsObject.value.hasOwnProperty(group) && userGroups.value.includes(group))
    Object.assign(userPermissionGroupsObject.value, { [group]: [] });
  else if (!userGroups.value.includes(group)) {
  }
  if (!userPermissionGroupsObject.value[group])
    throw new Error(
      `userPermissionGroupsObject.value[group] at getSubGroupModelValue evaluates to false.`
    );
  return userPermissionGroupsObject.value[group] as TPermissionSubgroupArray;
};

const updateSubGroupModelValue = (
  group: TPermissionGroup,
  value: readonly TPermissionSubgroup[]
) => {
  if (!userPermissionGroupsObject.value[group])
    throw new Error(
      `userPermissionGroupsObject.value at setSubGroupModelValue has no key ${group}`
    );
  ((userPermissionGroupsObject.value as Partial<IPermissionGroups>)[
    group
  ] as TPermissionSubgroupArray) = value as TPermissionSubgroupArray;
};

const sortedPermissionGroups: ComputedRef<Partial<IPermissionGroups>> = computed(() => {
  const sortProperty = <T extends TPermissionSubgroup[]>(partialArray: T, completeArray: T): T => {
    return partialArray.sort((a, b) => completeArray.indexOf(a) - completeArray.indexOf(b)) as T;
  };

  const sortedGroups: Partial<IPermissionGroups> = {};

  for (const key in adminGroupObject) {
    if (userPermissionGroupsObject.value[key as keyof IPermissionGroups]) {
      sortedGroups[key as keyof IPermissionGroups] = sortProperty(
        userPermissionGroupsObject.value[key as keyof IPermissionGroups] as TPermissionSubgroup[],
        adminGroupObject[key as keyof IPermissionGroups] as TPermissionSubgroup[]
      ) as any;
    }
  }

  return sortedGroups;
});

const saveData: ComputedRef<{
  user: SimpleUser;
  confidentiality: TConfidentiality;
  groups: Partial<IPermissionGroups>;
}> = computed(() => {
  return {
    user: user,
    confidentiality: userConfidentiality.value,
    groups: sortedPermissionGroups.value,
  };
});

watchEffect(() => {
  emit("save-data", saveData.value);
});
</script>

<template>
  <v-select
    v-model="userConfidentiality"
    label="Confidentiality"
    :items="userConfidentialityItems"
  ></v-select>

  <v-list lines="three" bg-color="surface-2">
    <v-list-subheader>{{ "Groups and sub-groups" }}</v-list-subheader>

    <v-list-item class="pt-0">
      <v-select
        v-model="userGroups"
        clearable
        label="Select Groups"
        :items="groups"
        multiple
        chips
      ></v-select>
    </v-list-item>

    <v-list-subheader v-show="userGroups.length > 0">{{ "Assign sub-groups." }}</v-list-subheader>
    <template v-for="selectedGroup in userGroups" :key="selectedGroup">
      <v-list-item>
        <v-select
          :modelValue="getSubGroupModelValue(selectedGroup)"
          @update:modelValue="(value: readonly TPermissionSubgroup[]) => updateSubGroupModelValue(selectedGroup, value)"
          :label="`sub-groups of ${selectedGroup} group`"
          :items="adminGroupObject[selectedGroup]"
          variant="underlined"
          multiple
          chips
        >
        </v-select>
      </v-list-item>
    </template>
  </v-list>
</template>
