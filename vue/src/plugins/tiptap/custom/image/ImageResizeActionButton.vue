<script setup lang="ts">
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Editor } from "@tiptap/vue-3";
import { computed, nextTick, ref, watch } from "vue";
import { ActionButton } from "vuetify-pro-tiptap";

interface Props {
  editor: Editor;
  tooltip?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: undefined,
  disabled: false,
});

const dialog = ref(false);
const width = ref<number>(0);
const height = ref<number>(0);
const aspectRatioLocked = ref<boolean>(true);

const originalWidth = ref<number>(0);
const originalHeight = ref<number>(0);

const isImageSelected = computed(() => {
  const selection = props.editor.state.selection;

  if (!("node" in selection)) {
    return false;
  }

  const { node } = selection as { node: ProseMirrorNode };
  const isImage = node.type.name === "image";

  if (isImage) {
    const view = props.editor.view;
    aspectRatioLocked.value = node.attrs.lockAspectRatio;

    const imgElement = view.dom.querySelector(`[src="${node.attrs.src}"]`) as HTMLImageElement;
    if (imgElement) {
      width.value = imgElement.width;
      height.value = imgElement.height;

      // Save original size for ratio calculations
      originalWidth.value = imgElement.naturalWidth;
      originalHeight.value = imgElement.naturalHeight;
    } else {
      width.value = 0;
      height.value = 0;
    }
  }

  return isImage;
});

// Aspect ratio logic:
watch(width, (newWidth) => {
  if (aspectRatioLocked.value && originalWidth.value) {
    height.value = Math.round((newWidth / originalWidth.value) * originalHeight.value);
  }
});

watch(height, (newHeight) => {
  if (aspectRatioLocked.value && originalHeight.value) {
    width.value = Math.round((newHeight / originalHeight.value) * originalWidth.value);
  }
});

function applyResize() {
  const attrs: Record<string, any> = {
    width: width.value,
  };

  if (!aspectRatioLocked.value) {
    attrs.height = height.value;
  }

  props.editor.chain().updateAttributes("image", attrs).run();

  nextTick(() => {
    dialog.value = false;
  });
}
</script>

<template>
  <ActionButton tooltip="Resize Image" :disabled="!isImageSelected">
    <v-icon icon="mdi-resize"></v-icon>

    <v-dialog v-model="dialog" width="400" activator="parent">
      <v-card>
        <v-toolbar density="compact" class="px-6">
          <span class="text-body-1">Resize Image</span>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon="mdi-close"> </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-number-input
            v-model="width"
            prepend-icon="mdi-arrow-split-vertical"
            :reverse="false"
            controlVariant="default"
            label="Width (px)"
            :hideInput="false"
            :inset="false"
          ></v-number-input>
          <div class="d-flex justify-center">
            <v-icon
              v-if="aspectRatioLocked"
              icon="mdi-link-variant"
              variant="text"
              size="large"
              style="margin-bottom: 22px"
            ></v-icon>
          </div>
          <v-number-input
            v-model="height"
            prepend-icon="mdi-arrow-split-horizontal"
            :reverse="false"
            controlVariant="default"
            label="Height (px)"
            :hideInput="false"
            :inset="false"
          ></v-number-input>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="applyResize">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ActionButton>
</template>
