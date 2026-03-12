<script setup lang="ts">
//biome-ignore-all lint/correctness/noUnusedVariables: They are needed */
//biome-ignore-all lint/correctness/noUnusedImports: They are needed */

import type { Tags } from "@/types";
import LabeledIcon from "./ui/LabeledIcon.vue";

const { tags } = defineProps<{
  tags: Tags;
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <LabeledIcon icon="Music" :label="tags.title" />
    <div class="flex items-center gap-4">
      <LabeledIcon class="text-sm" :size="20" icon="SquareUser" :label="tags.artist" />
      <LabeledIcon
        v-if="tags.album"
        class="text-sm"
        :size="20"
        icon="DiscAlbum"
        :label="tags.album"
      />
    </div>
  </div>
</template>
