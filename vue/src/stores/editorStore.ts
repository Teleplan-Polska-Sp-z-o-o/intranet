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

  const getDefault = (key: string, withBase: boolean = false): string => {
    const formString = (value: string) => {
      if (withBase)
        return `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content">${value}</div>`;
      else return value;
    };

    switch (key) {
      case "change-reason":
        return formString('<p><span style="color:hsl(0, 0%, 60%);">Change Reason</span></p>');
      case "change-description":
        return formString('<p><span style="color:hsl(0, 0%, 60%);">Change Description</span></p>');

      default:
        throw new Error(`Default key for ${key} not set.`);
    }
  };

  const getRef = (): string => {
    if (!eRef.value) return uuidv4();
    return eRef.value;
  };

  return { save, get, getDefault, getRef };
});
