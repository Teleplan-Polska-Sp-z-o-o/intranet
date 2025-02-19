<script setup lang="ts">
import { nextTick, onMounted, ref, unref, watch } from "vue";
import { DocumentTypes } from "../../../../../../../../../../../interfaces/document/DocumentTypes";
import { Chips } from "../../../../../../../../../../../models/document/Chips";
import { CompetenceManager } from "../../../../../../../../../../../models/document/CompetenceManager";
import { components } from "../../../../../../../../../../../plugins/vuetify/components";
import { UserManager } from "../../../../../../../../../../../models/user/UserManager";
import { SimpleUser } from "../../../../../../../../../../../models/user/SimpleUser";
import { esdBase64, noEsdBase64 } from "./esdBase64";
import {
  EStatus,
  useStepperStore,
} from "../../../../../../../../../../../stores/documents/creator/useStepperStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const tBase = "tools.matrix.tabs.documents.creator.createNew.stepper.info";

const THIS_STEP = 1;
const store = useStepperStore();
const formInfo = ref<components.VForm | null>(null);

// watch(
//   () => store.status,
//   (status) => {
//     nextTick(() => {
//       if (status.enum !== EStatus.EDIT) {
//         const form = unref(formInfo);
//         if (!form) return;

//         // console.log("Reset form (not in EDIT mode)");
//         form.reset();
//       }
//     });
//   },
//   { deep: true }
// );

// watchEffect(() => {
//   const form = unref(formInfo);
//   const stepper = store.stepper;
//   if (!stepper) return;

//   const step = stepper.currentStep;

//   nextTick(async () => {
//     if (!form || step !== THIS_STEP) return;
//     // console.log("form and step are both valid");

//     const isEditState = store.status.enum === EStatus.EDIT;
//     if (isEditState) {
//       // console.log("validate form");
//       await stepper.validateForm(form);
//     }

//     const window = stepper.getWindow(step);
//     if (!window.form) {
//       // console.log("assign of form");
//       window.form = form;
//     }
//   });
// });

watch(
  [() => store.stepper, () => store.status],
  ([stepper, status], [_oldStepper, oldStatus]) => {
    if (stepper === null || status === null) return;

    const window = stepper.getWindow(THIS_STEP);
    const step = stepper.currentStep;

    if (status.tick !== oldStatus?.tick)
      nextTick(() => {
        if (status.enum !== EStatus.EDIT) {
          const form = unref(formInfo);
          if (!form) return;

          form.reset();
        }
      });

    if (step !== THIS_STEP)
      nextTick(async () => {
        const form = unref(formInfo);
        if (!form) return;

        // console.log("form and step are both valid");
        const isEditState = status.enum === EStatus.EDIT;
        if (isEditState) {
          // console.log("validate form");
          await stepper.validateForm(form);
        }

        if (!window.form) {
          // console.log("assign of form");
          window.form = form;
        }
      });
  },
  { deep: true, immediate: true }
);

const rules = {
  product: [
    (v: string | null) =>
      typeof v === "string"
        ? !!v.trim() || t(`${tBase}.validationRules.product`)
        : t(`${tBase}.validationRules.product`),
  ],
  owner: [
    (v: { id: number; name: string } | string | null) =>
      typeof v === "string" ? !!v.trim() : !!v || t(`${tBase}.validationRules.owner`),
  ],
  author: [
    (v: { id: number; name: string } | string | null) =>
      typeof v === "string" ? !!v.trim() : !!v || t(`${tBase}.validationRules.author`),
  ],
};

// input options
const userOptions = ref<{ id: number; name: string }[]>([]);

const competenceOptions = ref<{ id: number; name: string }[]>([]);
const esdOptions = [
  {
    id: 1,
    image: esdBase64,
    name: t(`${tBase}.esdOptionESD`),
  },
  { id: 0, image: noEsdBase64, name: t(`${tBase}.esdOptionNA`) },
];

onMounted(async () => {
  try {
    const userManager: UserManager = new UserManager();
    userOptions.value = (await userManager.get()).map((u) => {
      return {
        id: u.id,
        name: new SimpleUser().build(u).getNormalizedUsername(),
      };
    });

    const retrieved: Array<DocumentTypes.ICompetenceEntity> = await new CompetenceManager().get(
      new Chips()
    );
    competenceOptions.value = retrieved.map((c) => {
      return { id: c.id, name: c.code };
    });
  } catch (error) {
    console.error("onMounted @InfoStep:", error);
  }
});
</script>
<template>
  <v-form ref="formInfo" class="bg-surface-2">
    <!-- props.stepper.getWindow(1).model.product -->
    <v-text-field
      :model-value="store.stepper!.getWindow(THIS_STEP).model.product"
      @update:model-value="
        (val: any) => (store.stepper!.getWindow(THIS_STEP).model.product = val ? val.trim() : '')
      "
      :rules="rules.product"
      :label="t(`${tBase}.product`)"
      variant="solo-filled"
      :hint="t(`${tBase}.productHint`)"
      persistent-hint
      prepend-icon="mdi-text-short"
    ></v-text-field>

    <v-combobox
      v-model="store.stepper!.getWindow(THIS_STEP).model.owner"
      :items="userOptions"
      item-title="name"
      return-object
      :rules="rules.owner"
      :label="t(`${tBase}.owner`)"
      variant="solo-filled"
      :hint="t(`${tBase}.ownerHint`)"
      persistent-hint
      prepend-icon="mdi-text-short"
    ></v-combobox>

    <v-date-input
      v-model="store.stepper!.getWindow(THIS_STEP).model.lastUpdate"
      :first-day-of-week="1"
      show-adjacent-months
      clearable
      @click:clear="() => (store.stepper!.getWindow(THIS_STEP).model.lastUpdate = null)"
      :label="t(`${tBase}.lastUpdate`)"
      variant="solo-filled"
      :hint="t(`${tBase}.lastUpdateHint`)"
      persistent-hint
    ></v-date-input>

    <v-combobox
      v-model="store.stepper!.getWindow(THIS_STEP).model.author"
      :items="userOptions"
      item-title="name"
      return-object
      :rules="rules.author"
      :label="t(`${tBase}.author`)"
      variant="solo-filled"
      :hint="t(`${tBase}.authorHint`)"
      persistent-hint
      prepend-icon="mdi-text-short"
    ></v-combobox>

    <v-date-input
      v-model="store.stepper!.getWindow(THIS_STEP).model.created"
      :first-day-of-week="1"
      show-adjacent-months
      :label="t(`${tBase}.created`)"
      variant="solo-filled"
      :hint="t(`${tBase}.createdHint`)"
      persistent-hint
    ></v-date-input>

    <v-combobox
      v-model="store.stepper!.getWindow(THIS_STEP).model.competences"
      :items="competenceOptions"
      item-title="name"
      return-object
      multiple
      chips
      :label="t(`${tBase}.trainingCodes`)"
      variant="solo-filled"
      :hint="t(`${tBase}.trainingCodesHint`)"
      persistent-hint
      prepend-icon="mdi-format-list-checks"
    ></v-combobox>

    <v-select
      v-model="store.stepper!.getWindow(THIS_STEP).model.esd"
      :items="esdOptions"
      item-title="name"
      item-value="id"
      :label="t(`${tBase}.esd`)"
      prepend-icon="mdi-format-list-text"
      :hint="t(`${tBase}.esdHint`)"
      persistent-hint
      variant="solo-filled"
    >
      <template #item="{ item, props }">
        <v-list-item v-bind="props">
          <template #title>
            <div class="d-flex align-center" :class="{ 'ga-3': item.raw.image }">
              <img :src="item.raw.image" />
              <span>{{ item.raw.name }}</span>
            </div>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </v-form>
</template>
