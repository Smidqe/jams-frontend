<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import AppPopover from "./AppPopover.vue";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "System" },
] as const;

const mode = useColorMode();
//state is the resolved theme for the icon, store is the chosen option (light/dark/auto)
const { state: theme, store: chosen } = mode;

const select = (value: (typeof OPTIONS)[number]["value"], hide: () => void) => {
  mode.value = value;
  hide();
};
</script>

<template>
  <AppPopover placement="bottom-end" content-class="p-1">
    <template #trigger="trigger">
      <Button variant="outline" v-bind="trigger">
        <Moon v-if="theme === 'dark'" />
        <Sun v-else />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </template>
    <template #default="{ hide }">
      <div class="flex flex-col gap-1">
        <Button
          v-for="option in OPTIONS"
          :key="option.value"
          variant="ghost"
          size="sm"
          class="justify-start"
          :aria-pressed="chosen === option.value"
          :class="{ 'bg-accent': chosen === option.value }"
          @click="select(option.value, hide)"
        >
          {{ option.label }}
        </Button>
      </div>
    </template>
  </AppPopover>
</template>
