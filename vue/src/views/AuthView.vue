<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../config/env";
import { Endpoints } from "../config/axios/Endpoints";
import { useSettingsStore } from "../stores/settingsStore";
import { ResponseStatus } from "../models/common/ResponseStatus";
import { IResponseStatus } from "../interfaces/common/IResponseStatus";
import alertResponseStatus from "../components/common/alertResponseStatus.vue";
import { UserEntity } from "../models/user/UserEntity";

// Router
const router = useRouter();

// Stores
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
    data.value.username.toLowerCase();
    const reqData: LoginData = data.value;

    axios
      .post(reqUrl, reqData)
      .then(function (response: any) {
        const user: UserEntity = response.data.userExist;
        userStore.set(new UserEntity().buildFromUserEntity(user));
        userStore.setToken(response.data.token);
        settingsStore.set(user.settings);
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
            <!-- <ms-sign-in></ms-sign-in> -->
            <!-- <v-spacer v-if="responseStatus"></v-spacer> -->
            <alert-response-status
              class="rounded-xl mt-2"
              :status="responseStatus"
              :persist="true"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
