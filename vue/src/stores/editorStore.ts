import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";

export const useEditorStore = defineStore("editor", () => {
  const editor = ref<Record<string, string>>({});
  const eRef = ref<string>("");

  const editors = computed(() => editor.value);

  const save = (value: string, key: string): string => {
    try {
      const baseTemplate = (value: string) =>
        `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content">${value}</div>`;
      const baseRegex =
        /<div class="ck-override-vuetify-styles"><\/div><div class="ck ck-content">.*<\/div>/;

      if (editor.value.hasOwnProperty(key)) {
        if (baseRegex.test(value)) {
          const match = value.match(/<div class="ck ck-content">(.*)<\/div>/);
          if (match && match[1]) {
            editor.value[key] = baseTemplate(match[1]);
          }
        } else {
          editor.value[key] = baseTemplate(value);
        }
      } else {
        editor.value = {
          ...editor.value,
          [key]: baseTemplate(value),
        };
      }
      return editor.value[key];
    } catch (error) {
      console.error(`editorStore at save: ${error}`);
      return "";
    }
  };

  const get = (key: string): string => {
    try {
      if (editor.value.hasOwnProperty(key)) {
        return editor.value[key];
      } else {
        throw new Error(`Invalid editor key: ${key}`);
      }
    } catch (error) {
      console.error(`returning: "", editorStore at get: ${error}`);
      return "";
    }
  };

  const getDefault = (key?: string, withBase: boolean = false): string => {
    try {
      const formString = (value: string) => {
        if (withBase)
          return `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content">${value}</div>`;
        else return value;
      };

      switch (key) {
        case "change-reason":
          return formString('<p><span style="color:hsl(0,0%,60%);">Change Reason</span></p>');
        case "change-description":
          return formString('<p><span style="color:hsl(0,0%,60%);">Change Description</span></p>');
        case "affected":
          return formString(
            '<p><span style="color:hsl(0,0%,60%);">Describe changes in this revision.</span></p>'
          );
        case undefined:
          return formString("");

        default:
          throw new Error(`Default key for ${key} not set.`);
      }
    } catch (error) {
      console.error(`returning: "", editorStore at getDefault: ${error}`);
      return "";
    }
  };

  const getRef = (): string => {
    try {
      if (!eRef.value) return uuidv4();
      return eRef.value;
    } catch (error) {
      console.error(`returning: "", editorStore at getRef: ${error}`);
      return "";
    }
  };

  return { editors, save, get, getDefault, getRef };
});
