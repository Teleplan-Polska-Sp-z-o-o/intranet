<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouteLocationNormalizedLoaded, useRouter } from "vue-router";
import { Breadcrumb } from "../../interfaces/common/Breadcrumb";
import { MetaBreadcrumbs } from "../../interfaces/common/MetaBreadcrumbs";

const { t } = useI18n();

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
      title: t(`common.default_layout.breadcrumbs.${typedMeta.parent}.${typedMeta.name}`),
      disabled: false,
      href: typedMeta.path ? typedMeta.path : exceptionOrBaseHref(route, path),
    };

    breadcrumbs.push(breadcrumb);
  }

  breadcrumbs[breadcrumbs.length - 1].disabled = true;

  return breadcrumbs;
};

const breadcrumbs = ref<Array<Breadcrumb>>([]);

watch(
  useRouter().currentRoute,
  (route) => {
    breadcrumbs.value = getBreadcrumbs(route);
  },
  { immediate: true }
);

// watchEffect(() => {
//   breadcrumbs.value = getBreadcrumbs();
// });
</script>

<template>
  <v-container class="layout-breadcrumbs">
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs" class="text-h5">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.href" :disabled="item.disabled" exact>
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
