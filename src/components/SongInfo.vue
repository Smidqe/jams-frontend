<script setup lang="ts">
//biome-ignore-all lint/correctness/noUnusedVariables: They are needed */
//biome-ignore-all lint/correctness/noUnusedImports: They are needed */

import type { Tags } from "@/types";
import { Music2Icon, User, Disc3 } from "lucide-vue-next";

const { tags } = defineProps<{
  tags: Tags;
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-1">
      <Music2Icon />
      <span> {{ tags.title ?? "Unknown title" }}</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1">
        <User :size="20" />
        <span class="text-sm"> {{ tags.artist ?? "Unknown artist" }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Disc3 :size="20" />
        <span class="text-sm"> {{ tags.album ?? "Unknown album" }}</span>
      </div>
    </div>
  </div>
</template>
