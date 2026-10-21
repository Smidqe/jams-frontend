<script setup lang="ts">
import { Disc3, Music2Icon, User } from "lucide-vue-next";
import type { Tags } from "@/types";

const { tags } = defineProps<{
  tags: Tags;
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-1">
      <Music2Icon />
      <span> {{ tags.TITLE ?? "Unknown title" }}</span>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1">
        <User :size="20" />
        <span class="text-sm"> {{ tags.ARTIST ?? "Unknown artist" }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Disc3 :size="20" />
        <span class="text-sm"> {{ tags.ALBUM ?? "Unknown album" }}</span>
      </div>
    </div>
  </div>
</template>
