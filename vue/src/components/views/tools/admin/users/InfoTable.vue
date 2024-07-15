<script setup lang="ts">
import { ref, watchEffect } from "vue";
import CrudTable from "../../../../../components/tools/CrudTable.vue";
import { useI18n } from "vue-i18n";
// import { IResponseStatus } from "../../../../../interfaces/common/IResponseStatus";
import { UserManager } from "../../../../../models/user/UserManager";
import { IUserInput } from "../../../../../interfaces/admin/users/IUserInput";
import { UserInput } from "../../../../../models/admin/users/UserInput";
import UsersForm from "./UsersForm.vue";
import { DepartmentsManager } from "../../../../../models/document/DepartmentsManager";
import { IUserInfo } from "../../../../../interfaces/admin/users/IUserInfo";
import { User } from "../../../../../models/user/User";

const emit = defineEmits(["table"]);

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
  { title: t(`${tPath}.header.position`), key: "info.position" },
  { title: t(`${tPath}.header.department`), key: "info.department" },
  { title: t(`${tPath}.header.decisionMaker`), key: "custom2" },
  { title: t(`${tPath}.header.actions`), key: "actions", sortable: false },
];

const toolbarTitle = t(`${tPath}.toolbar`);
const searchTitle = t(`tools.common.search`);

const reqData = ref<any>(null);

const componentProps = async (): Promise<Array<UserInput>> => {
  const array = [];
  const departments = (await new DepartmentsManager().get()).map((dep) => dep.name);
  const inputs: Array<IUserInput> = [
    {
      id: 0,
      variant: "text",
      label: "Position",
      val: "",
    },
    {
      id: 1,
      variant: "select",
      label: "Department",
      items: departments,
      val: "",
    },
    {
      id: 2,
      variant: "select",
      label: "Decision Maker",
      items: ["Yes", "No"],
      val: "",
    },
  ];

  for (const input of inputs) {
    array.push(new UserInput(input));
  }

  return array;
};

const handleSaveData = (data: { user: User; item: any; inputs: Array<UserInput> }) => {
  if (!data) return;
  const position = data.inputs.at(0)?.val || null;
  const department = data.inputs.at(1)?.val || null;
  let decisionMaker: boolean | null = null;
  if (data.inputs.at(2)?.val === "Yes") decisionMaker = true;
  if (data.inputs.at(2)?.val === "No") decisionMaker = false;

  const info: IUserInfo = {
    position: position,
    department: department,
    decisionMaker: decisionMaker,
  };

  const formData: FormData = new FormData();
  formData.append("user", JSON.stringify(data.user));
  formData.append("info", JSON.stringify(info));

  reqData.value = formData;
};

const manager = new UserManager();

const decisionMaker = (item: any) => {
  const d: boolean = !!item.info?.decisionMaker;
  if (d) return "Yes";
  else return "No";
};

// const handleResponseStatus = (status: IResponseStatus) => emit("responseStatus", status);
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
    :tableDialogComponent="UsersForm"
    :tableDialogComponentProps="{ inputs: componentProps() }"
  >
    <template v-slot:table-key-slot-2="{ item }">
      <span class="text-body-2">{{ decisionMaker(item) }}</span>
    </template>
    <!-- <template v-slot:table-key-slot="{ item }">
      <span class="text-body-2">{{ permission(item) }}</span>
    </template> -->
  </crud-table>
</template>
