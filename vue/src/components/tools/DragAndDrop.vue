<template>
  <div
    :style="{
      height,
    }"
  >
    <div
      class="d-flex align-center justify-center highlight-area"
      style="height: 100%"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <h1 class="title font-weight-regular text-center">
        <v-btn outlined class="mr-1" color="primary" @click="onClickImportFile"> Click here </v-btn>
        <input id="import-ele-input_file" :accept="fileExtns" type="file" style="display: none" />
        to select the import file(s)<br />
        Or<br />
        Drag-and-drop the file(s) to start importing files
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      required: false,
      default: () => "50vh",
    },
    multiple: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    fileExtns: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  methods: {
    onDrop(e) {
      e = e || window.event;
      e.preventDefault();
      const files = [];
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let index = 0; index < e.dataTransfer.items.length; index++) {
          if (e.dataTransfer.items[index].kind === "file") {
            files.push(e.dataTransfer.items[index].getAsFile());
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let index = 0; index < e.dataTransfer.files.length; index++) {
          files.push(e.dataTransfer.files[index]);
        }
      }
      this.$emit("files", files);
    },
    onDragOver(e) {
      e.preventDefault();
    },
    onClickImportFile() {
      const inputELe = document.getElementById("import-ele-input_file");
      inputELe.setAttribute("type", "file");
      if (this.multiple) {
        inputELe.setAttribute("multiple", "");
      }
      inputELe.addEventListener("change", (e) => {
        e = e || window.event;
        this.$emit("files", e.target.files);
      });
      inputELe.click();
    },
  },
};
</script>

<style scoped>
.highlight-area {
  border-style: dashed;
  border-color: rgb(185, 185, 185);
  border-width: 3.2px;
  padding: 12px 18px;
}
</style>
