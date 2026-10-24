<script setup lang="ts">
import { Disc3, Music2Icon, User } from "lucide-vue-next";
import type { Tags } from "@/types";

const { tags } = defineProps<{
  tags: Tags;
}>();
</script>

<template>
  <div class="[&_svg]:mr-1 [&_svg]:inline [&_svg]:align-text-bottom">
    <p class="truncate"><Music2Icon :size="20" />{{ tags.TITLE ?? "Unknown title" }}</p>
    <p class="truncate text-sm">
      <User :size="16" />{{ tags.ARTIST ?? "Unknown artist" }} · <Disc3 :size="16" />{{
        tags.ALBUM ?? "Unknown album"
      }}
    </p>
  </div>
</template>
