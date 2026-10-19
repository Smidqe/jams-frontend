<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

//a Popover with buttons instead of DropdownMenu, the Popover is already in the bundle for the volume
const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "System" },
] as const;

const mode = useColorMode();
//state is the resolved theme for the icon, store is the chosen option (light/dark/auto)
const { state: theme, store: chosen } = mode;
const open = ref(false);

const select = (value: (typeof OPTIONS)[number]["value"]) => {
  mode.value = value;
  open.value = false;
};
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline">
        <Moon v-if="theme === 'dark'" />
        <Sun v-else />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="flex w-auto flex-col gap-1 p-1">
      <Button
        v-for="option in OPTIONS"
        :key="option.value"
        variant="ghost"
        size="sm"
        class="justify-start"
        :aria-pressed="chosen === option.value"
        :class="{ 'bg-accent': chosen === option.value }"
        @click="select(option.value)"
      >
        {{ option.label }}
      </Button>
    </PopoverContent>
  </Popover>
</template>
