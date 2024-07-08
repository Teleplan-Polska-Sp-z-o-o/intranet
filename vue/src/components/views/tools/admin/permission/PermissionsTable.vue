<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { Permission } from "../../../../../models/user/Permission";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import PermissionForm from "./PermissionForm.vue";
import {
  IPermission,
  IPermissionGroups,
  TConfidentiality,
  TPermissionStringCode,
} from "../../../../../interfaces/user/UserTypes";
import { UserPermissionManager } from "../../../../../models/user/UserPermissionManager";
import { UserEntity } from "../../../../../models/user/UserEntity";
import { User } from "../../../../../models/user/User";

const emit = defineEmits(["table", "responseStatus"]);

const props = defineProps<{
  tab: string;
}>();

const { t } = useI18n();
const tab = ref<string>(props.tab);
watchEffect(() => (tab.value = props.tab));
const tPath = `tools.admin.tabs.${tab.value}.table`;

const headers: any = [
  { title: t(`${tPath}.header.username`), align: "start", key: "username" },
  {
    title: t(`${tPath}.header.confidentiality`),
    key: "permission.confidentiality",
  },
  { title: t(`${tPath}.header.permission`), key: "custom", sortable: false },
  { title: t(`${tPath}.header.groups`), key: "custom2", minWidth: 200, sortable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: {
  user: User;
  permission: TPermissionStringCode;
  confidentiality: TConfidentiality;
  groups: Partial<IPermissionGroups>;
}) => {
  if (!data) return;

  const formData: FormData = new FormData();
  formData.append("user", JSON.stringify(data.user));
  formData.append("permission", JSON.stringify(new Permission(data.permission)));
  formData.append("confidentiality", JSON.stringify(data.confidentiality));
  formData.append("groups", JSON.stringify(data.groups));

  reqData.value = formData;
};

const manager = new UserPermissionManager();

const permission = (item: any) => {
  const p: IPermission = item.permission;
  if (p.control) return "admin";
  if (p.write) return "moderator";
  else return "user";
};

const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);
</script>

<template>
  <crud-table
    :headers="headers"
    :sortBy="[{ key: 'username', order: 'asc' }]"
    :searchBy="['username', 'domain']"
    :toolbarTitle="toolbarTitle"
    :searchTitle="searchTitle"
    :manager="manager"
    @save-data="handleSaveData"
    :req-data="reqData"
    :tableEdit="true"
    :tableDelete="true"
    :tableDialogComponent="PermissionForm"
    :tableDialogComponentProps="{}"
    @responseStatus="handleResponseStatus"
  >
    <template v-slot:table-key-slot="{ item }">
      <span class="text-body-2">{{ permission(item) }}</span>
    </template>
    <template v-slot:table-key-slot-2="{ item }: { item: UserEntity }">
      <div>
        <template
          v-if="item.permission.groups.length > 0"
          v-for="group in item.permission.groups"
          :key="group"
        >
          <div class="text-body-2 pa-1">
            <span>{{ `${group.name}: ` }}</span
            ><span>{{ group.subgroups.map((sub) => sub.name).join(", ") }}</span>
          </div>
        </template>
        <template v-else
          ><span class="text-body-2">{{ "No data" }}</span></template
        >
      </div>
    </template>
  </crud-table>
</template>
