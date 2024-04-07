<script setup lang="ts">
import { ref } from "vue";
import { INewsEntity } from "./../../../../interfaces/editor/INewsEntity";
import { watchEffect } from "vue";

const props = defineProps<{
  eNews: Partial<INewsEntity>;
  bgImage: Array<File>;
}>();

const news = ref<Partial<INewsEntity>>(props.eNews);
const image = ref<Array<File>>(props.bgImage);

watchEffect(() => {
  image.value = props.bgImage;
});
</script>

<template>
  <v-sheet border class="rounded-xl mb-4">
    <v-table>
      <thead>
        <tr>
          <th rowspan="2">Title</th>
          <th rowspan="2">Subtitle</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{ news.title }}</td>
          <td>{{ news.subtitle }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
  <v-sheet border class="rounded-xl">
    <v-table>
      <thead>
        <tr>
          <th>Background Image Name</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{ image.at(0)?.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>
