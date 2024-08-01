<script setup lang="ts">
import ExpansionPanelAlert from "../../../../common/ExpansionPanelAlert.vue";
// Decision Maker
// Indicates that this individual has the authority to make significant decisions within specific tools. Such individuals can, for example, approve PCNs and PCRs
const list = [
  {
    id: 0,
    title: "Confidentiality",
    text: "Represents the level of access to information requiring confidentiality classifications: public, restricted, or secret. Access limitations apply to activities such as searching and displaying documents.",
  },
  {
    id: 1,
    title: "Groups",
    text: "Groups determine which tools are visible and accessible to the user. Subgroups within each group represent the specific tabs within a tool that the user can view and interact with.",
  },
];
</script>

<template>
  <expansion-panel-alert
    alertType="info"
    expansionPanelTitle="Fields Description"
    :list="list"
  ></expansion-panel-alert>
</template>
