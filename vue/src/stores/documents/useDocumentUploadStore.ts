import { defineStore } from "pinia";
import { ref, unref } from "vue";
import { DocumentCreatorManager } from "../../models/document/creator/CreatorManager";

export interface FileToUpload {
  file: File;
  language: string; // code
}
export type FilesToUpload = FileToUpload[];

export interface IProcessing {
  inProgress: boolean;
  toBeDoneCount: number;
  doneCount: number;
}

class Processing implements IProcessing {
  inProgress: boolean;
  toBeDoneCount: number;
  doneCount: number;

  constructor(inProgress: boolean = false, toBeDoneCount: number = 0, doneCount: number = 0) {
    this.inProgress = inProgress;
    this.toBeDoneCount = toBeDoneCount;
    this.doneCount = doneCount;
  }

  update(options: { inProgress?: boolean; toBeDoneCount?: number; doneCount?: number }) {
    const { inProgress, toBeDoneCount, doneCount } = options;
    if (inProgress !== undefined) this.inProgress = inProgress;
    if (toBeDoneCount !== undefined) this.toBeDoneCount = toBeDoneCount;
    if (doneCount !== undefined) this.doneCount = doneCount;
  }

  resetCount() {
    this.toBeDoneCount = 0;
    this.doneCount = 0;
  }
}

export const useDocumentGenerateUploadStore = defineStore("document-generate-upload", () => {
  const languages = ref<string[]>([]);
  const filesToUpload = ref<FilesToUpload>([]);
  const processing = ref<Processing>(new Processing());

  const reset = () => {
    unref(processing).resetCount();
    languages.value = [];
    filesToUpload.value = [];
  };

  const process = async (id: number, fileName: string) => {
    const manager = new DocumentCreatorManager();
    const langs = unref(languages);
    filesToUpload.value = [];
    unref(processing).update({ inProgress: true, toBeDoneCount: langs.length });

    for (const language of langs) {
      try {
        const file = await manager.generate(id, language, false, true, fileName);
        if (file) {
          filesToUpload.value.push({ file, language });
        }
      } catch (error) {
        console.error(`Error generating document for language: ${language}`, error);
      } finally {
        unref(processing).update({ doneCount: ++unref(processing).doneCount });
      }
    }
    unref(processing).update({ inProgress: false });
  };

  return {
    languages,
    filesToUpload,
    processing,
    process,
    reset,
  };
});
