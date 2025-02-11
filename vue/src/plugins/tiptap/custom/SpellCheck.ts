import { Extension } from "@tiptap/core";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const SpellCheck = Extension.create({
  name: "spellCheck",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("spellCheck"),
        props: {
          decorations(state: EditorState) {
            try {
              // Ensure the document is loaded
              if (!state || !state.doc || !state.schema) {
                console.warn("SpellCheck Plugin: ProseMirror state is not ready.");
                return DecorationSet.empty; // ✅ Prevents errors when loading
              }

              const decorations: Decoration[] = [];

              // **Replace this with your own dictionary/API check**
              //   const dictionary = new Set(["hello", "world", "tiptap", "editor"]); // ✅ Example dictionary

              // Loop through the document to find words
              state.doc.descendants((node, pos) => {
                if (!node.isText) return;

                const words = node.text?.split(/\s+/);
                let offset = 0;

                words?.forEach((word) => {
                  // !dictionary.has(word.toLowerCase()) && word.length > 2
                  if (false) {
                    // Highlight incorrect words with a wavy underline
                    const decoration = Decoration.inline(pos + offset, pos + offset + word.length, {
                      class: "spell-error",
                    });
                    decorations.push(decoration);
                  }
                  offset += word.length + 1; // Account for spaces
                });
              });

              return DecorationSet.create(state.doc, decorations);
            } catch (error) {
              console.error("SpellCheck Plugin: Error processing decorations", error);
              return DecorationSet.empty;
            }
          },
        },
      }),
    ];
  },
});
