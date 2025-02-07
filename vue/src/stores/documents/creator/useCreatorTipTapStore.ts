import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCreatorTipTapStore = defineStore("document-creator-tiptap", () => {
  // Reactive state for storing the editor content
  const documentContent = ref<string>("");
  // Reactive state for storing the editor content limit
  const documentContentLimit = ref<number>(0);

  // Computed property to count words
  const wordsCount = computed(() => {
    if (!documentContent.value.trim()) return 0;
    return documentContent.value.trim().split(/\s+/).length;
  });

  // Computed property to count characters (excluding spaces)
  const charactersCount = computed(() => {
    return documentContent.value.length;
  });

  // Function to update content and trigger count calculations
  const updateCounts = (newContent: string) => {
    documentContent.value = newContent;
  };
  const updateLimit = (newLimit: number) => {
    documentContentLimit.value = newLimit;
  };

  return {
    documentContent,
    documentContentLimit,
    wordsCount,
    charactersCount,
    updateCounts,
    updateLimit,
  };
});
