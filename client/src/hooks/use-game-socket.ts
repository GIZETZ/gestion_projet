import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useGameSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      socket = io({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("Connected to server via socket.io");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socket.on("error", (error) => {
        console.error("Socket.io error:", error);
      });
    }

    return () => {
      // Don't disconnect socket on component unmount
      // We want to keep it alive for real-time updates
    };
  }, [queryClient]);

  return socket;
}
