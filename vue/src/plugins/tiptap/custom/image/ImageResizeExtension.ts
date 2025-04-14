import type { ButtonView, GeneralOptions } from "vuetify-pro-tiptap";

import { Extension } from "@tiptap/core";
import ImageResizeActionButton from "./ImageResizeActionButton.vue";

export interface ImageResizeOptions extends GeneralOptions<ImageResizeOptions> {
  button: ButtonView;
}
export default Extension.create<ImageResizeOptions>({
  name: "imageResize",

  addOptions() {
    return {
      divider: false,
      spacer: false,
      button: () => ({
        component: ImageResizeActionButton,
        componentProps: {},
      }),
    };
  },
});
