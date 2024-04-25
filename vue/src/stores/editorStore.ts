import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

export const useEditorStore = defineStore("editor", () => {
  const editor = ref<Record<string, string>>({});
  const eRef = ref<string>("");

  const save = (value: string, key: string): void => {
    editor.value = {
      ...editor.value,
      [key]: value,
    };
  };

  const get = (key: string): string => {
    if (editor.value.hasOwnProperty(key)) {
      return editor.value[key];
    } else {
      throw new Error(`Invalid editor key: ${key}`);
    }
  };

  const getRef = (): string => {
    if (!eRef.value) return uuidv4();
    return eRef.value;
  };

  return { save, get, getRef };
});
