<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { nodeConfig } from "../../config/env";
import { useSettingsStore } from "../../stores/settingsStore";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { UserEntity } from "../../models/user/UserEntity";
import { Endpoints } from "../../config/axios/Endpoints";
import Translate from "../../components/common/Translate.vue";
import { useI18n } from "vue-i18n";
import LanguageManager from "../../models/common/settings/LanguageManager";
import staticResponseStatus from "../../components/common/StaticResponseStatus.vue";

const smallScreen = ref<boolean>(window.innerWidth < 960);

// Router
const router = useRouter();

// Stores
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const languageManager = new LanguageManager();

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
const { t } = useI18n();

const validation = ref<boolean>(false);
const nameRules = computed(() => [
  (value: string) => !!value || t(`common.default_layout.auth.rules.login_req`),
  (value: string) => {
    if (/^[a-zA-Z]+\.[a-zA-Z]+\d*$/.test(value)) return true;
    return t(`common.default_layout.auth.rules.login_format`);
  },
  // /^[a-zA-Z]+\.[a-zA-Z]+$/
]);
const domainRules = computed(() => [
  (value: string) => !!value || t(`common.default_layout.auth.rules.domain_req`),
]);

const passwordRules = computed(() => [
  (value: string) => !!value || t(`common.default_layout.auth.rules.password_req`),
]);

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
        languageManager.updateLanguageSettings();
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
          id="auth-form"
          :loading="loader"
          variant="flat"
          :width="smallScreen ? '75%' : '40%'"
          class="bg-surface-1 h-auto d-flex flex-column align-center mx-auto rounded-xl position-relative"
        >
          <span id="speed-dial-anchor" class="position-absolute top-0 right-0 mr-10">
            <translate variant="speed-dial" attach-speed-dial-to="speed-dial-anchor"></translate>
          </span>

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
                  <v-select
                    color="primary"
                    :label="$t(`common.default_layout.auth.template.domain_label`)"
                    v-model="data.domain"
                    :items="['reconext.com', 'tgn.teleplan.com']"
                    :rules="domainRules"
                    required
                    prepend-inner-icon="mdi-at"
                  ></v-select>
                </v-row>

                <v-row>
                  <v-text-field
                    color="primary"
                    class="mb-2"
                    v-model="data.username"
                    :rules="nameRules"
                    :label="$t(`common.default_layout.auth.template.login_label`)"
                    required
                    prepend-inner-icon="mdi-account-outline"
                    :suffix="`@${data.domain}`"
                  ></v-text-field
                ></v-row>

                <v-row>
                  <v-text-field
                    color="primary"
                    class="mb-2"
                    v-model="data.password"
                    :append-inner-icon="passwordIcon"
                    @click:append-inner="passwordVisibility = !passwordVisibility"
                    :label="$t(`common.default_layout.auth.template.password_label`)"
                    :type="passwordType"
                    required
                    prepend-inner-icon="mdi-form-textbox-password"
                    :rules="passwordRules"
                  >
                  </v-text-field>
                </v-row>
                <a
                  class="text-caption text-decoration-none text-info d-block text-right"
                  href="https://password.reconext.com/authorization.do"
                  rel="noopener noreferrer"
                  tabindex="-1"
                  target="_blank"
                >
                  {{ $t(`common.default_layout.auth.template.password_massage`) }}</a
                >
              </v-container>
              <v-btn
                type="submit"
                color="primary"
                class="rounded-xl"
                :text="$t(`common.default_layout.auth.template.proceed`)"
              />
            </v-form>
            <static-response-status
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
