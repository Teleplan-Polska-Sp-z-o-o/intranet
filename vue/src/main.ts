// @ts-check

import { createApp } from "vue";
import App from "./App.vue";

import { vuetify } from "./plugins/vuetify/vuetify.ts";
import "./assets/style.scss";

import { pinia } from "./plugins/pinia/pinia.ts";
import { router } from "./plugins/router/router.ts";
import { i18n } from "./plugins/i18n/i18n.ts";
import CKEditor from "@ckeditor/ckeditor5-vue";

const app = createApp(App);

app.use(vuetify);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(CKEditor);

app.mount("#app");
