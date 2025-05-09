<script setup lang="ts">
import { VForm } from "vuetify/lib/components/VForm/index.mjs";
import { ref, computed, onMounted } from "vue";
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
import { AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
// const smallScreen = ref<boolean>(window.innerWidth < 960);

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
  password?: string;
  azureIdToken?: string;
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
        console.error(error);

        reset();
        responseStatus.value = new ResponseStatus({
          code: error.response.status,
          message: error.response.data.statusMessage,
        });
      })
      .finally(() => {
        loading(false);
      });
  }
};

const msal: PublicClientApplication = new PublicClientApplication({
  auth: {
    clientId: "2d4d603d-f0bc-4727-9b23-40b08c2e6e63", // client ID
    authority: "https://login.microsoftonline.com/7e8ee4aa-dcc0-4745-ad28-2f942848ac88", // tenant ID
    redirectUri: "http://localhost",
  },
});

const loginWithMicrosoft = (): void => {
  msal.loginRedirect({
    scopes: ["openid", "profile", "email"],
  });
};

onMounted(async () => {
  await msal.initialize();

  const response: AuthenticationResult | null = await msal.handleRedirectPromise();
  if (response) {
    const idToken = response.idToken;
    if (!idToken) return;

    responseStatus.value = null;
    loading(true);

    const reqUrl = `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserAuth}`;
    const [name, domain] = response.account.username.trim().toLowerCase().split("@");
    const reqData: LoginData = {
      username: name,
      domain: domain,
      azureIdToken: idToken,
    };

    axios
      .post(reqUrl, reqData)
      .then((res) => {
        const user: UserEntity = res.data.userExist;
        userStore.set(new UserEntity().buildFromUserEntity(user));
        userStore.setToken(res.data.token);
        settingsStore.set(user.settings);
        languageManager.updateLanguageSettings();
        router.push({ path: "/pages" });
      })
      .catch((error) => {
        console.error("Azure login failed:", error);
        responseStatus.value = new ResponseStatus({
          code: error.response?.status || 500,
          message: error.response?.data?.statusMessage || "Unknown error during Microsoft login",
        });
      })
      .finally(() => {
        loading(false);
      });
  }
});
</script>

<template>
  <v-container class="layout-view-container h-100 mb-0 bg-background">
    <v-row justify="center" align="center" class="h-100">
      <!-- d-flex flex-column justify-center h-screen-->
      <v-col class="ma-n2" align-self="center" xxl="3" xl="4" lg="6" sm="8" xs="12">
        <!-- :width="smallScreen ? '75%' : '40%'" -->
        <v-card
          id="auth-form"
          :loading="loader"
          variant="flat"
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
                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-select
                      color="primary"
                      :label="$t(`common.default_layout.auth.template.domain_label`)"
                      v-model="data.domain"
                      :items="['reconext.com', 'tgn.teleplan.com']"
                      :rules="domainRules"
                      required
                      prepend-inner-icon="mdi-at"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-text-field
                      color="primary"
                      v-model="data.username"
                      :rules="nameRules"
                      :label="$t(`common.default_layout.auth.template.login_label`)"
                      required
                      prepend-inner-icon="mdi-account-outline"
                      :suffix="`@${data.domain}`"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-text-field
                      color="primary"
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
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col align-self="end" sm="10" xs="12">
                    <a
                      class="text-caption text-decoration-none text-info d-block text-right"
                      href="https://password.reconext.com/authorization.do"
                      rel="noopener noreferrer"
                      tabindex="-1"
                      target="_blank"
                    >
                      {{ $t(`common.default_layout.auth.template.password_massage`) }}</a
                    >
                  </v-col>
                </v-row>
                <v-row justify="center" class="mt-4">
                  <v-col align-self="center" sm="8" xs="12" class="ga-4">
                    <v-btn
                      type="submit"
                      color="primary"
                      class="rounded-lg w-100"
                      :text="$t(`common.default_layout.auth.template.proceed`)"
                    />
                    <v-divider class="my-4 w-50">
                      {{ $t("common.default_layout.auth.template.or") }}
                    </v-divider>
                    <v-btn
                      color="tertiary"
                      variant="tonal"
                      class="rounded-lg w-100"
                      :text="
                        xs
                          ? $t('common.default_layout.auth.template.microsoft_short_label')
                          : $t('common.default_layout.auth.template.microsoft_label')
                      "
                      @click="loginWithMicrosoft"
                    >
                      <template #prepend>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 32 32"
                          width="20"
                          height="20"
                        >
                          <path d="M0 0h15.206v15.206H0z" fill="#f25022" />
                          <path d="M16.794 0H32v15.206H16.794z" fill="#7fba00" />
                          <path d="M0 16.794h15.206V32H0z" fill="#00a4ef" />
                          <path d="M16.794 16.794H32V32H16.794z" fill="#ffb900" />
                        </svg>
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
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
