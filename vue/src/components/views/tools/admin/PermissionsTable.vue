<script setup lang="ts">
import { ref, watchEffect } from "vue";
// import EditTable from "../../../../components/tools/EditTable.vue";
import CrudTable from "../../../../components/tools/CrudTable.vue";
import DialogInput from "../../../tools/DialogInput.vue";
import { UserPermissionManager } from "../../../../models/user/UserPermissionManager";
import { IUser } from "../../../../interfaces/user/IUser";
import { IPermission } from "../../../../interfaces/user/IPermission";
import { Permission } from "../../../../models/user/Permission";
import { useI18n } from "vue-i18n";
import { IResponseStatus } from "../../../../interfaces/common/IResponseStatus";

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
  { title: t(`${tPath}.header.domain`), key: "domain" },
  { title: t(`${tPath}.header.permission`), key: "custom", sortable: false },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const handleSaveData = (data: any) => {
  if (!data) return;

  const user: IUser = {
    id: data.item.id,
    username: data.item.username,
    domain: data.item.domain,
  };

  const permission: IPermission = new Permission(data.model);

  reqData.value = { user, permission };
};

const manager = new UserPermissionManager();

const permission = (item: any) => {
  const { id, ...permissionWithoutId } = item.permission;
  const p: IPermission = permissionWithoutId;
  if (p.control) return "Admin";
  if (p.write) return "Moderator";
  else return "User";
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
    :tableDialogComponent="DialogInput"
    :tableDialogComponentProps="{ label: 'Permission', items: ['User', 'Moderator', 'Admin'] }"
    @responseStatus="handleResponseStatus"
  >
    <template v-slot:table-key-slot="{ item }">
      <span class="text-body-2">{{ permission(item) }}</span>
    </template>
  </crud-table>
</template>
