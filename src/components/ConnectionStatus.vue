<script setup lang="ts">
import { LoaderCircle, WifiOff } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useSessionStore } from "@/stores/session";

const { connection } = storeToRefs(useSessionStore());
</script>

<template>
  <div v-if="connection !== 'OPEN'" class="flex items-center gap-1 text-xs text-muted-foreground">
    <template v-if="connection === 'CONNECTING'">
      <LoaderCircle :size="16" class="animate-spin" />
      <span>Connecting…</span>
    </template>
    <template v-else>
      <WifiOff :size="16" />
      <span>Disconnected, reconnecting…</span>
    </template>
  </div>
</template>
