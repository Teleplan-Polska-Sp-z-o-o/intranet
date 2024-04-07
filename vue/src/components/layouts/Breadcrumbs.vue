<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { Breadcrumb } from "../../interfaces/common/Breadcrumb";
import { MetaBreadcrumbs } from "../../interfaces/common/MetaBreadcrumbs";

const { t } = useI18n();
const router = useRouter();

const getBreadcrumbs = (): Array<Breadcrumb> => {
  const matchedRoutes = router.currentRoute.value.matched;

  const breadcrumbs: Array<Breadcrumb> = [];

  for (const routeRecord of matchedRoutes) {
    const { path, meta } = routeRecord;

    const typedMeta: MetaBreadcrumbs = meta.breadcrumbs as MetaBreadcrumbs;

    if (!typedMeta.include) continue;

    const breadcrumb: Breadcrumb = {
      title: t(`common.default_layout.breadcrumbs.${typedMeta.parent}.${typedMeta.name}`),
      disabled: typedMeta.disabled ?? false,
      href: typedMeta.path ? typedMeta.path : path,
    };

    breadcrumbs.push(breadcrumb);
  }

  return breadcrumbs;
};

const breadcrumbs = ref<Array<Breadcrumb>>(getBreadcrumbs());

watch(router.currentRoute, () => {
  breadcrumbs.value = getBreadcrumbs();
});

watchEffect(() => {
  breadcrumbs.value = getBreadcrumbs();
});
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
