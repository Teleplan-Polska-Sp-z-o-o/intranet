import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "prosemirror-state";

const characterLimitKey = new PluginKey("wholeWordSelection");
const CharacterLimit = Extension.create({
  name: "characterLimit",

  addOptions() {
    return {
      limit: 1000,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: characterLimitKey,
        filterTransaction: (transaction, state) => {
          const textSize = state.doc.textContent.length;
          const nextTextSize = transaction.doc.textContent.length;

          // Allow deletions or noop
          if (nextTextSize <= textSize) {
            return true;
          }

          // Allow if under limit
          if (nextTextSize <= this.options.limit) {
            return true;
          }

          // Block if adding and over limit
          return false;
        },
      }),
    ];
  },

  // onTransaction({ editor, transaction }) {
  //   const text = transaction.doc.textContent;
  //   // console.log("text.length", text.length);
  //   // console.log("text.length > this.options.limit", text.length > this.options.limit);
  //   if (text.length > this.options.limit) {
  //     editor.commands.undo(); // Reverts the last action instead of truncating
  //   }
  // },
});

export { CharacterLimit };
