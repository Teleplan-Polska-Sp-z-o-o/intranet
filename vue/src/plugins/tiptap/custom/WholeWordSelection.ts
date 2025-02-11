import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

const wholeWordSelectionKey = new PluginKey("wholeWordSelection"); // ✅ Unique key for plugin

const WholeWordSelection = Extension.create({
  name: "wholeWordSelection",

  addOptions() {
    return {
      lastSelection: null, // ✅ Store last selection range
      isDragging: false, // ✅ Track if the user is dragging
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: wholeWordSelectionKey, // ✅ Assign the unique key to avoid duplicates
        props: {
          handleDOMEvents: {
            // ✅ 1️⃣ Detect when the user starts dragging
            mousedown: (_view, event) => {
              this.options.isDragging = false;

              // ✅ Ensure event.target exists before using it
              if (event.target instanceof HTMLElement) {
                event.target.addEventListener(
                  "mousemove",
                  () => {
                    this.options.isDragging = true;
                  },
                  { once: true }
                );
              }

              return false;
            },

            mouseup: (view, event) => {
              const { state } = view;
              let { from, to } = state.selection;
              const lastSelection = this.options.lastSelection;

              //   // ✅ If dragging, allow natural selection (don't modify behavior)
              //   if (this.options.isDragging) {
              //     return false;
              //   }

              // ✅ 1️⃣ If clicking inside an existing selection, clear selection
              if (lastSelection && from >= lastSelection.from && to <= lastSelection.to) {
                this.options.lastSelection = null;
                view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, to)));
                return true;
              }

              // ✅ If double-click, If dragging, expand to whole word
              if (event.detail === 2 || this.options.isDragging) {
                // Define regex: Selects letters but NOT spaces or punctuation
                const letterRegex = /\p{L}/u;
                const nonLetterRegex = /^[^\p{L}]+|[^\p{L}]+$/u; // ✅ Matches leading OR trailing non-letters

                // ✅ 2️⃣ If no selection, expand to whole word
                while (nonLetterRegex.test(state.doc.textBetween(from, to, " "))) {
                  if (/^[^\p{L}]+/u.test(state.doc.textBetween(from, from + 1, " "))) from++;
                  if (/[^\p{L}]+$/u.test(state.doc.textBetween(to - 1, to, " "))) to--;
                }

                // **Expand left side, but stop at spaces**
                while (from > 0 && letterRegex.test(state.doc.textBetween(from - 1, from, " "))) {
                  from--;
                }

                // **Expand right side, but stop at spaces**
                while (
                  to < state.doc.content.size &&
                  letterRegex.test(state.doc.textBetween(to, to + 1, " "))
                ) {
                  to++;
                }

                // **Temporary Selection to Force UI Refresh**
                const tempSelection = TextSelection.create(
                  state.doc,
                  from,
                  Math.min(to + 1, state.doc.content.size)
                );

                // ✅ Store the new selection
                this.options.lastSelection = { from, to };

                // ✅ Apply the expanded selection
                view.dispatch(state.tr.setSelection(tempSelection).scrollIntoView());

                // **Reapply the Correct Selection**
                setTimeout(() => {
                  view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)));
                }, 0);

                return true;
              }

              // ✅ Otherwise, just place the cursor naturally (single click)
              return false;
            },
          },
        },
      }),
    ];
  },
});

export { WholeWordSelection };
