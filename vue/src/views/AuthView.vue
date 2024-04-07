<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { usePermissionStore } from "../stores/permissionStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../config/env";
import { Endpoints } from "../config/Endpoints";
import { User } from "../models/user/User";
import { Permission } from "../models/user/Permission";
import { useSettingsStore } from "../stores/settingsStore";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";

// Router
const router = useRouter();

// Stores
const permissionStore = usePermissionStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

// Form reference
const login = ref<typeof VForm | null>(null);

// Form loading animation
const loader = ref<boolean>(false);

// Form data
interface LoginData {
  username: string;
  domain: string;
  password: string;
}

const data = ref<LoginData>({
  username: "",
  domain: "reconext.com",
  password: "",
});

const responseStatus = ref<IResponseStatus | null>(null);

// const loginError = ref<LoginError | null>(null);

// Password
const passwordVisibility = ref<boolean>(false);
const passwordIcon = computed((): string => (passwordVisibility.value ? "mdi-eye" : "mdi-eye-off"));
const passwordType = computed((): string => (passwordVisibility.value ? "text" : "password"));

// Form Validation
const validation = ref<boolean>(false);
const nameRules = computed(() => [
  (value: string) => !!value || "User name is required.",
  (value: string) => {
    if (/^[a-zA-Z]+\.[a-zA-Z]+\d*$/.test(value)) return true;
    return "Please enter the user name in the format: 'name.surname'";
  },
  // /^[a-zA-Z]+\.[a-zA-Z]+$/
]);
const domainRules = computed(() => [(value: string) => !!value || "Domain is required."]);
const passwordRules = computed(() => [(value: string) => !!value || "Password is required."]);

// Form Methods

const reset = (): Promise<boolean> => login.value?.reset();

const loading = (bool: boolean): boolean => {
  loader.value = bool;
  return loader.value;
};

const submitLogin = (): void => {
  if (validation.value) {
    responseStatus.value = null;
    loading(true);
    const reqUrl: string = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAuth}`;
    data.value.username.toLocaleLowerCase();
    const reqData: LoginData = data.value;

    axios
      .post(reqUrl, reqData)
      .then(function (response) {
        userStore.set(new User(response.data.userExist));

        const permission = { ...response.data.userExist.permission };
        delete permission.id;

        permissionStore.set(new Permission(permission));
        settingsStore.set(response.data.userExist.settings);
        router.push({ path: "/pages" });
      })
      .catch(function (error) {
        console.log(error);

        loading(false);
        reset();
        responseStatus.value = new ResponseStatus({
          code: error.response.status,
          message: error.response.data.statusMessage,
        });
      });
  }
};

// const proceed = (): void => {
//   loading(true);
//   const user = {
//     id: null,
//     username: null,
//     domain: null,
//   };
//   const permission = {
//     read: true,
//     write: false,
//     control: false,
//   };
//   userStore.set(new User(user));
//   permissionStore.set(new Permission(permission));
//   router.push({ path: "/pages" });
// };
</script>

<template>
  <v-container class="layout-view-container mb-0 bg-background">
    <v-row>
      <v-col class="h-screen ma-n2 d-flex flex-column justify-center">
        <v-card
          :loading="loader"
          color="primary"
          variant="outlined"
          :width="300"
          class="h-auto d-flex flex-column align-center mx-auto rounded-xl"
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="primary"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title class="text-secondary text-h3 text-center mt-4 mb-2">Intranet</v-card-title>
          <v-card-text class="w-100">
            <v-form
              ref="login"
              class="d-flex flex-column"
              v-model="validation"
              @submit.prevent="submitLogin"
            >
              <v-container fluid>
                <v-row>
                  <v-text-field
                    color="primary"
                    class="mb-2"
                    v-model="data.username"
                    :rules="nameRules"
                    label="Username"
                    required
                  ></v-text-field
                ></v-row>
                <v-row>
                  <v-select
                    color="primary"
                    label="Domain"
                    v-model="data.domain"
                    :items="['reconext.com', 'tgn.teleplan.com']"
                    :rules="domainRules"
                    required
                  ></v-select>
                </v-row>
                <v-row>
                  <v-text-field
                    color="primary"
                    class="mb-2"
                    v-model="data.password"
                    :rules="passwordRules"
                    :append-inner-icon="passwordIcon"
                    @click:append-inner="passwordVisibility = !passwordVisibility"
                    label="Password"
                    :type="passwordType"
                    required
                  />
                </v-row>
              </v-container>
              <v-btn type="submit" color="primary" class="rounded-xl">Login</v-btn>
            </v-form>
            <!-- <v-spacer v-if="responseStatus"></v-spacer> -->
            <alert-response-status
              class="rounded-xl mt-2"
              :status="responseStatus"
              :persist="true"
            />
          </v-card-text>
        </v-card>

        <!-- <v-sheet :width="300" class="h-auto d-flex flex-column align-center mx-auto">
          <v-container fluid class="bg-surface-1 text-on-surface rounded-xl elevation-6">
            <v-row>
              <v-col>
                <h1 class="text-primary text-h2 text-center">Intranet</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-form
                  ref="login"
                  class="d-flex flex-column"
                  v-model="validation"
                  @submit.prevent="submitLogin"
                >
                  <v-container fluid>
                    <v-row>
                      <v-text-field
                        color="primary"
                        class="mb-2"
                        v-model="data.username"
                        :rules="nameRules"
                        label="Username"
                        required
                      ></v-text-field
                    ></v-row>
                    <v-row>
                      <v-select
                        color="primary"
                        label="Domain"
                        v-model="data.domain"
                        :items="['reconext.com', 'tgn.teleplan.com']"
                        :rules="domainRules"
                        required
                      ></v-select>
                    </v-row>
                    <v-row>
                      <v-text-field
                        color="primary"
                        class="mb-2"
                        v-model="data.password"
                        :rules="passwordRules"
                        :append-inner-icon="passwordIcon"
                        @click:append-inner="passwordVisibility = !passwordVisibility"
                        label="Password"
                        :type="passwordType"
                        required
                      />
                    </v-row>
                  </v-container>
                  <v-btn type="submit" color="primary">Login</v-btn>
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <alert-response-status :status="responseStatus" :persist="true" />
              </v-col>
            </v-row>
            
            <v-spacer v-if="!responseStatus"></v-spacer>
          </v-container>

          <v-progress-linear
            :active="loader"
            :indeterminate="loader"
            bottom
            color="primary"
          ></v-progress-linear>
        </v-sheet> -->
      </v-col>
    </v-row>
  </v-container>
</template>
