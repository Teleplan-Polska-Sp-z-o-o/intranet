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
  // Heading,
  Color,
  // Highlight,
  // TextAlign,
  // FontSize,
  BulletList,
  OrderedList,
  // TaskList,
  Indent,
  Image,
  Table,
  Clear,
  History,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
import "./github.scss";
import { CharacterLimit } from "./custom/CharacterLimit";

const vuetifyProTipTap = createVuetifyProTipTap({
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
          text: [
            "bold",
            "italic",
            "underline",
            "strike",
            "divider",
            "color",
            // "highlight",
            // "textAlign",
            "indent",
            // "divider",
            // "link",
          ],
        },
        defaultBubbleList: (editor) => {
          // You can customize the bubble menu here
          return defaultBubbleList(editor); // default customize bubble list
        },
      },
      // paragraph: false,
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    // TextAlign.configure({
    //   types: ["listItem", "paragraph"],
    //   alignments: ["left", "center", "right", "justify"],
    // }),
    // FontSize.configure({
    //   types: ["textStyle"],
    //   fontSizes: [10, 11, 12],
    // }),
    Color,
    // Highlight.configure(),
    Clear.configure({ divider: true }),
    BulletList,
    OrderedList,
    // TaskList,
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
    CharacterLimit,
    // Heading.configure({
    //   levels: [], // Supports heading levels but not in UI
    // }),
  ],
});

export { vuetifyProTipTap };
