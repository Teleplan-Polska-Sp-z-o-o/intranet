import { defineStore } from "pinia";
import { computed, ref, unref } from "vue";
import { IDraftEntity } from "../../../models/document/creator/IDraftEntity";
import { DraftsSearch } from "../../../components/views/tools/matrix/document/creator/tabs/drafts/DraftFiltersTypes";
import { useUserStore } from "../../userStore";
import { SimpleUser } from "../../../models/user/SimpleUser";

export const useDraftsStore = defineStore("document-drafts", () => {
  const drafts = ref<IDraftEntity[]>([]);
  const draftsSearch = ref<DraftsSearch>(new DraftsSearch());
  const resetDraftsSearch = (): void => {
    draftsSearch.value = new DraftsSearch();
  };

  const computedDrafts = computed(() => {
    return drafts.value.filter((draft) => {
      const userStore = useUserStore();
      const userEntity = userStore.info();
      if (!userEntity) return true;

      const user = new SimpleUser().build(userEntity);
      const bar = unref(draftsSearch).bar;
      const filters = unref(draftsSearch).filters;

      // 🔎 Search Bar Filter (Draft Name, Document Title, Document Id-Rev)
      if (bar) {
        const matchesSearch =
          draft.id.toString().includes(bar) ||
          draft.name.toLowerCase().includes(bar) ||
          draft.stepper._documentTitle.toLowerCase().includes(bar) ||
          draft.stepper._documentIdRevision.toLowerCase().includes(bar);
        if (!matchesSearch) return false;
      }

      ///
      // Navigator filter
      ///
      const navigatorSwitch = filters.locator.mainInput.value;
      if (navigatorSwitch !== null) {
        const isLocated = draft.stepper.tz === navigatorSwitch;

        if (!isLocated) return false;
      }
      ///

      ///
      // Creator filter
      ///
      const creatorSwitch = filters.creator.mainInput.value;
      if (creatorSwitch !== null) {
        const isCreator = draft.createdBy.user.id === user.id;

        if (creatorSwitch && !isCreator) return false;
        if (creatorSwitch === false && isCreator) return false;
      }

      const creatorSideInput = filters.creator.sideInput?.value;
      if (typeof creatorSideInput === "object") {
        const isCreator = draft.createdBy.user.id === user.id;

        if (!isCreator) return false;
      }
      ///

      ///
      /// Editor filter (Applying Same Logic as Creator)
      ///
      const editorSwitch = filters.editor.mainInput.value;
      if (editorSwitch !== null) {
        const isEditor = draft.updatedBy.some((update) => update.user.id === user.id);

        if (editorSwitch && !isEditor) return false;
        if (editorSwitch === false && isEditor) return false;
      }

      const editorSideInput = filters.editor.sideInput?.value;
      if (typeof editorSideInput === "object") {
        const isEditor = draft.updatedBy.some((update) => update.user.id === user.id);
        if (!isEditor) return false;
      }

      return true;
    });
  });
  return {
    drafts,
    draftsSearch,
    resetDraftsSearch,
    computedDrafts,
  };
});
