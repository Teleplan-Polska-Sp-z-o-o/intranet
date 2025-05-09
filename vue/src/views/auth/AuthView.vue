<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { VForm } from "vuetify/components";
import { useUserStore } from "../../stores/userStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useRouter } from "vue-router";
// import { nodeConfig } from "../../config/env";
// import { Endpoints } from "../../config/axios/Endpoints";
import axios from "axios";
import { Endpoints } from "../../config/axios/Endpoints";
import staticResponseStatus from "../../components/common/StaticResponseStatus.vue";
// import Translate from "../../components/common/Translate.vue";
import LanguageManager from "../../models/common/settings/LanguageManager";
import { UserEntity } from "../../models/user/UserEntity";
import { ResponseStatus } from "../../models/common/ResponseStatus";
import { useI18n } from "vue-i18n";
import { useMsalStore } from "../../stores/msalStore";

const { t } = useI18n();
const { xs } = useDisplay();
const router = useRouter();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const languageManager = new LanguageManager();
const msalStore = useMsalStore();
const formValidation = ref<boolean>(false);
const loader = ref<boolean>(false);
const loading = (bool: boolean): boolean => {
  loader.value = bool;
  return loader.value;
};
const passwordVisibility = ref(false);
const passwordIcon = computed<"mdi-eye" | "mdi-eye-off">(() =>
  passwordVisibility.value ? "mdi-eye" : "mdi-eye-off"
);
const passwordType = computed<"text" | "password">(() =>
  passwordVisibility.value ? "text" : "password"
);
const changeVisibility = () => {
  passwordVisibility.value = !passwordVisibility;
};

const responseStatus = ref<null | ResponseStatus>(null);
const username = ref<string>("");
const domain = ref<string>("reconext.com");
const password = ref<string>("");

const formComponent = ref<typeof VForm | null>(null);

const login = (
  endpoint: string,
  data: {
    username: string;
    domain: string;
    password?: string;
    azureIdToken?: string;
  }
): void => {
  if (formValidation) {
    responseStatus.value = null;
    loading(true);

    axios
      .create({
        baseURL: `${window.location.origin}:${3000}`,
      })
      .post(endpoint, data)
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

        // formComponent.value?.reset();
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

// const msal = new PublicClientApplication({
//   auth: {
//     clientId: "2d4d603d-f0bc-4727-9b23-40b08c2e6e63",
//     authority: "https://login.microsoftonline.com/7e8ee4aa-dcc0-4745-ad28-2f942848ac88",
//   },
// });

// const loginWithMicrosoft = (): void => {
//   msal.loginRedirect({ scopes: ["openid", "profile", "email"] });
// };

const loginWithMicrosoft = async (): Promise<void> => {
  try {
    // await msalStore.init();
    const msalResult = await msalStore.msalInstance.loginPopup({
      scopes: ["openid", "profile", "email"],
    });
    if (msalResult?.idToken) {
      const [username, domain] = msalResult.account.username.trim().toLowerCase().split("@");
      login(Endpoints.UserAuth, {
        username,
        domain,
        azureIdToken: msalResult.idToken,
      });
    }
  } catch (error) {
    console.error("Popup login failed:", error);
  }
};

// onMounted(async () => {
//   await msal.initialize();
//   const msalResult: AuthenticationResult | null = await msal.handleRedirectPromise();
//   if (msalResult?.idToken) {
//     const [username, domain] = msalResult.account.username.trim().toLowerCase().split("@");
//     login(Endpoints.UserAuth, {
//       username,
//       domain,
//       azureIdToken: msalResult.idToken,
//     });
//   }
// });

const submitForm = async () => {
  const isValid = await formComponent.value?.validate();
  if (!isValid) return;

  login(Endpoints.UserAuth, {
    username: username.value,
    domain: domain.value,
    password: password.value,
  });
};
</script>

<template>
  <v-container class="layout-view-container bg-background mb-0 pa-0">
    <v-row justify="center" align="center" class="w-100 h-screen">
      <v-col class="reconext w-100 h-100" align-self="center" cols="12">
        <div class="reconext-clouds"></div>
        <div class="reconext-building"></div>
        <v-card
          id="auth-form"
          :loading="loader"
          class="bg-surface-1 h-auto d-flex flex-column align-center mx-auto rounded-xl position-relative pa-0"
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
              ref="formComponent"
              class="d-flex flex-column"
              v-model="formValidation"
              @submit.prevent="submitForm"
              :disabled="loader"
            >
              <v-container fluid class="pa-0">
                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-select
                      color="primary"
                      :label="t(`common.default_layout.auth.template.domain_label`)"
                      v-model="domain"
                      :items="['reconext.com', 'tgn.teleplan.com']"
                      required
                      prepend-inner-icon="mdi-at"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-text-field
                      color="primary"
                      v-model="username"
                      :label="t(`common.default_layout.auth.template.username_label`)"
                      required
                      prepend-inner-icon="mdi-account-outline"
                      :suffix="`@${domain}`"
                      :rules="[
                        (value: string) => !!value || t(`common.default_layout.auth.rules.username_req`),
                        (value: string) => {
                          if (/^[a-zA-Z]+\.[a-zA-Z]+\d*$/.test(value)) return true;
                          return t(`common.default_layout.auth.rules.username_format`);
                        },
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col align-self="center" sm="10" xs="12">
                    <v-text-field
                      color="primary"
                      v-model="password"
                      :append-inner-icon="passwordIcon"
                      @click:append-inner="changeVisibility()"
                      :label="t(`common.default_layout.auth.template.password_label`)"
                      :type="passwordType"
                      required
                      prepend-inner-icon="mdi-form-textbox-password"
                      :rules="[
                        (value: string) => !!value || t(`common.default_layout.auth.rules.password_req`),
                      ]"
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
                      {{ t(`common.default_layout.auth.template.password_massage`) }}</a
                    >
                  </v-col>
                </v-row>
                <v-row justify="center" class="mt-4">
                  <v-col align-self="center" sm="10" xs="12" class="ga-4">
                    <v-btn
                      type="submit"
                      color="primary"
                      class="rounded-lg w-100"
                      :text="t('common.default_layout.auth.template.proceed')"
                      :disabled="!formComponent || !formComponent?.isValid || loader"
                      @click="submitForm"
                    />
                    <v-divider class="my-4 w-50">
                      {{ t("common.default_layout.auth.template.or") }}
                    </v-divider>
                    <v-btn
                      color="tertiary"
                      variant="tonal"
                      class="rounded-lg w-100"
                      :text="
                        xs
                          ? t('common.default_layout.auth.template.microsoft_short_label')
                          : t('common.default_layout.auth.template.microsoft_label')
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

                <v-row justify="center" class="mt-4">
                  <v-col align-self="center" sm="10" xs="12" class="ga-4">
                    <static-response-status
                      class="rounded-xl w-100"
                      :status="responseStatus"
                      :persist="true"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
$animation-duration: 120s;
$cloud-image: "../../../../../auth/clouds.svg";
$building-image: "../../../../../auth/building.svg";

.reconext {
  position: relative;
  left: 12px;
  top: 12px;
  overflow: hidden;

  .reconext-clouds {
    position: absolute;
    top: 0;
    left: 0;
    width: 400%;
    height: 100%;
    background: url(#{$cloud-image}) no-repeat left center;
    // background-size: 100% auto;
    background-size: cover;
    animation: moveClouds $animation-duration linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  .reconext-building {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(#{$building-image}) no-repeat center center;
    background-size: cover;
    pointer-events: none;
    z-index: 1;
  }

  #auth-form {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    margin: 0 auto;
    width: 80%;

    @media (max-width: 599px) {
      // xs

      left: 0;
      max-width: 400px;
    }

    @media (min-width: 600px) and (max-width: 959px) {
      // sm
      left: 0;
      max-width: 400px;
    }

    @media (min-width: 960px) and (max-width: 1279px) {
      // md
      left: 0;
      max-width: 400px;
    }

    @media (min-width: 1280px) {
      // lg and up
      left: 20%;
      max-width: 500px;
    }
  }
}

@keyframes moveClouds {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-75%);
  }
}
</style>
