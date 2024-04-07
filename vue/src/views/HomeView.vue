<script setup lang="ts">
import { computed, ref, watch } from "vue";
// import weather from "../components/common/weather.vue";
import { useI18n } from "vue-i18n";
// import frequentlyUsed from "../components/views/home/frequentlyUsed.vue";
import { nodeConfig } from "../config/env";
import { INewsEntity } from "../interfaces/editor/INewsEntity";
import { INewsCard } from "../interfaces/editor/INewsCard";
import { NewsManager } from "../models/editor/NewsManager";
import { NewsCard } from "../models/editor/NewsCard";

const smallScreen = ref<boolean>(window.innerWidth < 960);
const boardCols = computed((): number => (smallScreen.value ? 12 : 8));

const constructImgSrc = (item: INewsEntity): string => {
  const backend = `${nodeConfig.origin}:${nodeConfig.port}/uploads/news/`;
  return `${backend}${item.bgImage}`;
};

const newsPage = ref<number>(0);
const news = ref<Array<INewsCard>>([]);

watch(news, () => newsPage.value++);

const api = async (skip: number, take: number): Promise<Array<INewsCard>> => {
  const manager = new NewsManager();
  const newItems: Array<INewsEntity> = await manager.get(true, skip, take);

  return newItems.map((news: INewsEntity) => new NewsCard(news));
};

const load = async ({ done }: { done: any }): Promise<void> => {
  // items per load
  const take = 3;
  // items to ommit from db (pagination)
  const skip = newsPage.value * take;

  const newItems = await api(skip, take);
  news.value = [...news.value, ...newItems];

  if (newItems.length > 0) done("ok");
  else done("empty");
};

// toggling

const toggleDetails = (cardId: number) => {
  const card = news.value.find((detail) => detail.id === cardId);
  if (card) {
    card.show = !card.show;
  }
};

const computedShowValue = (itemId: number) => {
  const item = news.value.find((item) => item.id === itemId);
  return item ? item.show : false;
};

const { t } = useI18n();
const exploreBtn = computed(() => t("common.default_layout.pages.home.card.explore"));
</script>

<template>
  <v-container class="layout-view-container d-flex flex-column bg-background pt-0 mt-0">
    <!-- <v-row>
      <frequently-used />
    </v-row> -->
    <v-row>
      <v-col class="pt-0" :cols="boardCols">
        <v-infinite-scroll :items="news" :onLoad="load" color="secondary">
          <template v-for="item in news" :key="item.id">
            <v-card class="ma-4 bg-surface-1 text-on-surface rounded-xl">
              <v-img height="300" :src="constructImgSrc(item)" cover></v-img>

              <v-card-item>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
              </v-card-item>

              <v-card-actions class="pb-4 px-4">
                <v-btn
                  variant="outlined"
                  color="secondary"
                  class="rounded-pill"
                  @click="() => toggleDetails(item.id)"
                  :text="exploreBtn"
                />
              </v-card-actions>

              <v-expand-transition>
                <div class="details" v-show="computedShowValue(item.id)">
                  <v-divider></v-divider>

                  <v-card-text v-html="item.content"> </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-infinite-scroll>
      </v-col>
      <v-col v-if="!smallScreen" cols="4">
        <!-- <weather></weather> -->
      </v-col>
    </v-row>
  </v-container>
</template>
