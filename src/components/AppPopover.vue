<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import type { HTMLAttributes } from "vue";
import { ref, useId, useTemplateRef } from "vue";
import { cn } from "@/lib/utils";

//native popover (top layer, light dismiss, esc, focus return), replaces reka Popover and floating-ui.
//no display utilities (flex, grid...) on contentClass, they'd override the hidden state, use an inner element
const props = withDefaults(
  defineProps<{
    placement?: "bottom-end" | "top-end";
    offset?: number;
    contentClass?: HTMLAttributes["class"];
  }>(),
  { placement: "bottom-end", offset: 4 },
);

const id = useId();
const root = useTemplateRef("root");
const panel = useTemplateRef("panel");
const style = ref<Record<string, string>>({});

//the trigger doesn't move while open, so it's enough to place the panel on open and on resize
const place = () => {
  if (!root.value) {
    return;
  }

  const rect = root.value.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  const right = `${clientWidth - rect.right}px`;

  style.value =
    props.placement === "bottom-end"
      ? { top: `${rect.bottom + props.offset}px`, right }
      : { bottom: `${clientHeight - rect.top + props.offset}px`, right };
};

const hide = () => panel.value?.hidePopover();

useEventListener(panel, "beforetoggle", (e: ToggleEvent) => e.newState === "open" && place());
useEventListener(window, "resize", () => panel.value?.matches(":popover-open") && place());
</script>

<template>
  <div ref="root" class="inline-flex">
    <slot name="trigger" :popovertarget="id" />
    <div
      :id="id"
      ref="panel"
      popover
      :style="style"
      :class="
        cn(
          'inset-auto m-0 rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
          contentClass,
        )
      "
    >
      <slot :hide="hide" />
    </div>
  </div>
</template>
