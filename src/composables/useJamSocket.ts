import { useWebSocket } from "@vueuse/core";
import { watch } from "vue";
import { parseMessage, wsUrl } from "@/lib/api";
import { useSessionStore } from "@/stores/session";

export const useJamSocket = () => {
  const session = useSessionStore();

  const { status } = useWebSocket(wsUrl(), {
    autoReconnect: true,
    onDisconnected: (_ws, ev) => console.warn("socket closed", ev.code, ev.reason),
    onError: (_ws, ev) => console.error("socket error", ev),
    onMessage: (_ws, msg) => {
      const event = parseMessage(msg.data);

      if (!event) {
        console.error("invalid socket message", msg.data);
        return;
      }

      session.handleEvent(event);
    },
  });

  watch(status, session.setConnection, { immediate: true });
};
