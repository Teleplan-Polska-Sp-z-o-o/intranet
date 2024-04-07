import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

export const useEditorStore = defineStore("editor", () => {
  const editor = ref<string>(
    `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content"></div>`
  );
  const eRef = ref<string>("");

  const save = (value: string): void => {
    editor.value = value;
  };

  const get = (): string => editor.value;

  const getRef = (): string => {
    if (!eRef.value) return uuidv4();
    return eRef.value;
  };

  return { save, get, getRef };
});
