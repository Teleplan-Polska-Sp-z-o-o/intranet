<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouteLocationNormalizedLoaded, useRouter } from "vue-router";
import { Breadcrumb } from "../../interfaces/common/Breadcrumb";
import { MetaBreadcrumbs } from "../../interfaces/common/MetaBreadcrumbs";

const { t, locale } = useI18n();
const router = useRouter();

const smallScreen = ref<boolean>(window.innerWidth < 960);

const exceptionOrBaseHref = (route: RouteLocationNormalizedLoaded, routeRecordPath: string) => {
  if (routeRecordPath.includes("/tool/documents")) {
    return `/tool/documents/browse/${route.params.tab}`;
  } else return routeRecordPath;
};

const getBreadcrumbs = (route: RouteLocationNormalizedLoaded): Array<Breadcrumb> => {
  const breadcrumbs: Array<Breadcrumb> = [];

  for (const routeRecord of route.matched) {
    const { path, meta } = routeRecord;

    const typedMeta: MetaBreadcrumbs = meta.breadcrumbs as MetaBreadcrumbs;
    if (!typedMeta.include) continue;

    const breadcrumb: Breadcrumb = {
      title:
        typeof typedMeta.name === "string"
          ? t(`common.default_layout.breadcrumbs.${typedMeta.parent}.${typedMeta.name}`)
          : typedMeta.name(route),
      disabled: false,
      href: typedMeta.path ? typedMeta.path : exceptionOrBaseHref(route, path),
    };

    breadcrumbs.push(breadcrumb);
  }

  breadcrumbs[breadcrumbs.length - 1].disabled = true;

  return breadcrumbs;
};

const updateBreadcrumbs = () => {
  const route = router.currentRoute.value;
  breadcrumbs.value = getBreadcrumbs(route);
};

const breadcrumbs = ref<Array<Breadcrumb>>([]);

watch(
  router.currentRoute,
  (route) => {
    breadcrumbs.value = getBreadcrumbs(route);
  },
  { immediate: true }
);

watch(
  () => locale.value,
  () => {
    updateBreadcrumbs();
  }
);
</script>

<template>
  <v-container class="layout-breadcrumbs">
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :to="item.href"
              :disabled="item.disabled"
              exact
              :class="{ 'text-h6': !smallScreen }"
            >
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-container>
</template>
