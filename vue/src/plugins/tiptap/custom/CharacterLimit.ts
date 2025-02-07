import { Extension } from "@tiptap/core";
// import { useCreatorTipTapStore } from "../../../stores/documents/creator/useCreatorTipTapStore";

const CharacterLimit = Extension.create({
  name: "characterLimit",

  addOptions() {
    return {
      limit: 450,
    };
  },

  // onTransaction({ transaction }) {
  //   const text = transaction.doc.textContent;

  //   // const tiptapStore = useCreatorTipTapStore();
  //   // tiptapStore.updateLimit(this.options.limit);
  //   // tiptapStore.updateCounts(text);

  //   if (text.length > this.options.limit)
  //     this.editor.commands.setContent(text.substring(0, this.options.limit));
  // },
  onTransaction({ editor, transaction }) {
    const text = transaction.doc.textContent;
    if (text.length > this.options.limit) {
      console.log("call undo()");
      editor.commands.undo(); // Reverts the last action instead of truncating
    }
  },
});

export { CharacterLimit };
