import { Extension } from "@tiptap/core";
import { PluginKey, Plugin, TextSelection } from "@tiptap/pm/state";

const wholeWordSelectionKey = new PluginKey("wholeWordSelection"); // ✅ Unique key for plugin

const WholeWordSelection = Extension.create({
  name: "wholeWordSelection",

  addOptions() {
    return {
      lastSelection: null,
      isDragging: false,
      isCellSelection: false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: wholeWordSelectionKey,
        props: {
          handleDOMEvents: {
            mousedown: (view, event) => {
              this.options.isDragging = false;
              this.options.dragStartPos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              return false;
            },

            mousemove: (view, event) => {
              if (this.options.dragStartPos) {
                const currentPos = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (currentPos && currentPos.pos !== this.options.dragStartPos.pos) {
                  this.options.isDragging = true;
                }
              }
              return false;
            },

            mouseup: (view, event) => {
              const { state } = view;
              let { from, to } = state.selection;
              const isInlineSelection = (selection: any) =>
                selection.$from.parent.inlineContent && selection.$to.parent.inlineContent;

              const isCellSelection = (selection: any) =>
                selection &&
                selection.ranges &&
                selection.ranges.length > 1 &&
                selection.$anchorCell &&
                selection.$headCell;

              if (!isInlineSelection(state.selection)) {
                return false;
              }

              if (isCellSelection(state.selection)) {
                return false;
              }

              if (!this.options.isDragging && (event.detail === 1 || event.detail === 2)) {
                return false;
              }
              // console.log(4);

              const letterRegex = /\p{L}/u;
              // const nonLetterRegex = /^[^\p{L}]+|[^\p{L}]+$/u;

              // while (nonLetterRegex.test(state.doc.textBetween(from, to, " "))) {
              //   // if (/^[^\p{L}]+/u.test(state.doc.textBetween(from, from + 1, " "))) from++;
              //   // if (/[^\p{L}]+$/u.test(state.doc.textBetween(to - 1, to, " "))) to--;
              //   if (/^[^\p{L}]+/u.test(state.doc.textBetween(from, from + 1, " "))) {
              //     from++;
              //     // console.log("incremented from", from);
              //   }
              //   if (/[^\p{L}]+$/u.test(state.doc.textBetween(to - 1, to, " "))) {
              //     to--;
              //     // console.log("decremented to", to);
              //   }
              // }

              // while (from > 0 && letterRegex.test(state.doc.textBetween(from - 1, from, " "))) {
              //   from--;
              // }
              while (from > 0) {
                const char = state.doc.textBetween(from - 1, from, " ");
                if (!letterRegex.test(char)) break;
                from--;
              }

              // while (
              //   to < state.doc.content.size &&
              //   letterRegex.test(state.doc.textBetween(to, to + 1, " "))
              // ) {
              //   to++;
              // }
              while (to < state.doc.content.size) {
                const char = state.doc.textBetween(to, to + 1, " ");
                if (!letterRegex.test(char)) break;
                to++;
              }
              const newFrom = Math.max(0, Math.min(from, state.doc.content.size));
              const newTo = Math.max(0, Math.min(to, state.doc.content.size));

              this.options.lastSelection = { from: newFrom, to: newTo };

              // const transaction = state.tr.setSelection(TextSelection.create(state.doc, newFrom, newTo));
              // view.focus();
              // view.dispatch(transaction);

              ///
              // const domSelection = window.getSelection();
              // const start = view.domAtPos(newFrom);
              // const end = view.domAtPos(newTo);

              // if (domSelection && start.node && end.node) {
              //   const range = document.createRange();
              //   range.setStart(start.node, start.offset);
              //   range.setEnd(end.node, end.offset);
              //   domSelection.removeAllRanges();
              //   domSelection.addRange(range);
              // }
              ///
              const transaction = state.tr.setSelection(
                TextSelection.create(state.doc, newFrom, newTo)
              );

              view.focus();
              view.dispatch(transaction);

              function isValidPosition(node: Node, offset: number) {
                if (!node) return false;
                if (node.nodeType === Node.TEXT_NODE) {
                  return offset <= (node.nodeValue?.length ?? 0);
                }
                return offset <= node.childNodes.length;
              }

              function isOrderCorrect(start: Range, end: Range) {
                const comparison = start.compareBoundaryPoints(Range.START_TO_START, end);
                return comparison <= 0;
              }

              const domSelection = window.getSelection();
              const start = view.domAtPos(newFrom);
              const end = view.domAtPos(newTo);

              if (
                domSelection &&
                start.node &&
                end.node &&
                isValidPosition(start.node, start.offset) &&
                isValidPosition(end.node, end.offset)
              ) {
                try {
                  const tempRange = document.createRange();
                  tempRange.setStart(start.node, start.offset);
                  tempRange.setEnd(end.node, end.offset);

                  if (isOrderCorrect(tempRange, tempRange)) {
                    domSelection.removeAllRanges();
                    domSelection.addRange(tempRange);
                  } else {
                    console.warn("Skipped invalid order of range");
                  }
                } catch (e) {
                  console.warn("Invalid range applied", e);
                }
              } else {
                console.warn("Skipped DOM selection due to failed checks");
              }
              ///

              this.options.isDragging = false;
              this.options.dragStartPos = null;

              return true;
            },
          },
        },
      }),
    ];
  },
});

export { WholeWordSelection };
