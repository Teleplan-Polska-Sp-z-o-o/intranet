<script setup lang="ts">
import { ref, watch } from "vue";
import { Editor } from "./ckeditor";
import { useEditorStore } from "../../stores/editorStore";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";

const emit = defineEmits(["ref"]);

const editor = Editor;

const editorStore = useEditorStore();

const props = defineProps<{
  endpoint?: Endpoints;
  editorKey: string;
}>();

const editorData = ref<string>(editorStore.get(props.editorKey));

const eRef = editorStore.getRef();

let editorConfig: any;
if (props.endpoint) {
  editorConfig = {
    ...editor.defaultConfig,
    simpleUpload: {
      uploadUrl: `${nodeConfig.origin}:${nodeConfig.port}${props.endpoint}`,
      headers: {
        ckeditor: "true",
        ref: eRef,
      },
    },
  };
} else {
  editorConfig = {
    ...editor.defaultConfig,
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "alignment",
        "outdent",
        "indent",
        "bulletedList",
        "numberedList",
        "pageBreak",
        "horizontalLine",
        "|",
        "heading",
        "fontFamily",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "highlight",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "link",
        "blockQuote",
        "insertTable",
        // "mediaEmbed",
        "|",
        "findAndReplace",
        "showBlocks",
        "removeFormat",
        "selectAll",
        "specialCharacters",
      ],
      shouldNotGroupWhenFull: true,
    },
  };
}

emit("ref", eRef);

// div.ck-override-vuetify-styles is the preceding styling element for ck output - see ckeditor.scss
watch(editorData, (newV) => {
  editorStore.save(
    `<div class="ck-override-vuetify-styles"></div><div class="ck ck-content">${newV}</div>`,
    props.editorKey
  );
});
</script>

<template>
  <ckeditor
    class="ck-override-vuetify-styles"
    :editor="editor"
    :config="editorConfig"
    v-model="editorData"
  ></ckeditor>
</template>

<style>
.ck.ck-content.ck-editor__editable {
  min-height: 360px !important;
}
.ck-body-wrapper {
  position: relative;
  z-index: 2401 !important;
}
</style>
