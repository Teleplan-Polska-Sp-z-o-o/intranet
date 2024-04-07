<script setup lang="ts">
// import { ref, watch } from "vue";
// import axios from "axios";
// import { nodeConfig } from "../../../config/env";
// import { Endpoints } from "../../../config/Endpoints";
// import { IResponseStatus } from "../../../interfaces/common/IResponseStatus";
// import { ResponseStatus } from "../../../models/common/ResponseStatus";
// import { IUser } from "../../../interfaces/user/IUser";
// import { useUserStore } from "../../../stores/userStore";

// const privilegeKey = ref<string>("");
// const responseStatus = ref<IResponseStatus | null>(null);
// const emit = defineEmits(["response-status"]);

// watch(privilegeKey, () => {
//   const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserSettingsPermission}`;

//   const userStore = useUserStore();
//   const user = userStore.info();

//   if (user) {
//     const reqData: { privilegeKey: string; user: IUser } = {
//       privilegeKey: privilegeKey.value,
//       user: user,
//     };

//     axios
//       .post(reqUrl, reqData)
//       .then(function (response) {
//         responseStatus.value = new ResponseStatus({
//           code: response.status,
//           message: response.data.message,
//         });
//         emit("response-status", responseStatus.value);
//       })
//       .catch(function (error) {
//         responseStatus.value = new ResponseStatus({
//           code: error.response.status,
//           message: error.response.data.message,
//         });
//         emit("response-status", responseStatus.value);
//       });
//   } else {
//     throw new Error("No user data found in localStorage");
//   }
// });
</script>

<template>
  <!-- <v-text-field
    v-model="privilegeKey"
    label="Privilege Key"
    type="password"
    hint="Ask your administrator for the key to acquire additional privileges."
  ></v-text-field> -->
</template>
