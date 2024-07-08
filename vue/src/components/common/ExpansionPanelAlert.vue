<script setup lang="ts">
/**
 * Props for the component
 * @property {string} alertType - The type of alert to display ("success" | "info" | "warning" | "error").
 * @property {string} expansionPanelTitle - The title of the expansion panel.
 * @property {Array<{ id: number; title: string; text: string }>} list - A list of items to display in the alert.
 */
const props = defineProps<{
  /**
   * The type of alert to display.
   * @type {"success" | "info" | "warning" | "error"}
   */
  alertType: "success" | "info" | "warning" | "error";
  /**
   * The title of the expansion panel.
   * @type {string}
   */
  expansionPanelTitle: string;
  /**
   * A list of items to display in the alert.
   * @type {Array<{ id: number; title: string; text: string }>}
   */
  list: Array<{ id: number; title: string; text: string }>;
}>();
/**
 * This component displays an expansion panel with an alert inside it.
 * The alert type and content are configurable via props.
 */
</script>

<template>
  <v-card class="mb-4 bg-surface-1 elevation-0 mx-0">
    <v-expansion-panels class="v-expansion-panels-width ma-1">
      <v-expansion-panel class="rounded-xl bg-surface-2">
        <v-expansion-panel-title>
          <v-icon :icon="`$${props.alertType}`" :color="props.alertType" class="mr-4"></v-icon>
          <span>{{ props.expansionPanelTitle }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text
          class="panel-text-9384729834123125161253673 rounded-b-xl bg-surface-2"
        >
          <!-- :color="props.alertType" -->
          <v-alert
            :type="props.alertType"
            icon=""
            border="start"
            variant="tonal"
            class="rounded-b-xl"
          >
            <v-list lines="three" bg-color="transparent">
              <v-list-item v-for="listItem in props.list" :key="listItem.id">
                <v-list-item-title>{{ listItem.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ listItem.text }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-alert>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped lang="scss">
.v-expansion-panels-width {
  width: calc(100% - 2 * 4px) !important;
}
</style>

<style>
.panel-text-9384729834123125161253673 > div {
  padding: 0 !important;
}
</style>
