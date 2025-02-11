import "vuetify-pro-tiptap/style.css";
import "./github.scss";

import {
  VuetifyTiptap,
  VuetifyViewer,
  createVuetifyProTipTap,
  defaultBubbleList,
} from "vuetify-pro-tiptap";

import {
  BaseKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  BulletList,
  OrderedList,
  Indent,
  Image,
  Table,
  Clear,
  History,
} from "vuetify-pro-tiptap";

import { CharacterLimit } from "./custom/CharacterLimit";
import { WholeWordSelection } from "./custom/WholeWordSelection";
// import { SpellCheck } from "./custom/SpellCheck";

const vuetifyProTipTap = createVuetifyProTipTap({
  lang: undefined,
  markdownTheme: "github",
  components: {
    VuetifyTiptap,
    VuetifyViewer,
  },
  extensions: [
    BaseKit.configure({
      bubble: {
        list: {
          image: ["image", "image-aspect-ratio", "remove"],
          text: ["bold", "italic", "underline", "strike", "divider", "color", "indent"],
        },
        defaultBubbleList: (editor) => {
          return defaultBubbleList(editor);
        },
      },
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    Color,
    Clear.configure({ divider: true }),
    BulletList,
    OrderedList,
    Indent,
    Image.configure({
      allowBase64: true,
      hiddenTabs: ["url"],
      upload(file: File) {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result); // Return Base64 string
            } else {
              reject("File could not be read as Base64.");
            }
          };

          reader.onerror = () => reject("Failed to read file.");
          reader.readAsDataURL(file); // Convert to Base64
        });
      },
    }),
    Table.configure({ divider: true }),
    History.configure(),
    // customs
    CharacterLimit,
    WholeWordSelection,
    // SpellCheck,
  ],
});

export { vuetifyProTipTap };
