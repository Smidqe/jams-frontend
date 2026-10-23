<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Monitor, Moon, Sun } from "lucide-vue-next";
import { computed } from "vue";
import { iconButton } from "@/lib/styles";

type Mode = "light" | "dark" | "auto";

const LABELS: Record<Mode, string> = { light: "Light", dark: "Dark", auto: "System" };
const NEXT: Record<Mode, Mode> = { light: "dark", dark: "auto", auto: "light" };

//store is the chosen option, not the resolved theme, so "auto" can be shown as its own state
const { store } = useColorMode();
const current = computed(() => store.value as Mode);

const cycle = () => (store.value = NEXT[current.value]);
</script>

<template>
  <button
    type="button"
    :class="iconButton"
    :title="`Theme: ${LABELS[current]}`"
    :aria-label="`Theme: ${LABELS[current]}, click to change`"
    @click="cycle"
  >
    <Sun v-if="current === 'light'" />
    <Moon v-else-if="current === 'dark'" />
    <Monitor v-else />
  </button>
</template>
