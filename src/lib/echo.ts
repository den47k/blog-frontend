import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>; // ToDo: Add event typing
  }
}

const initializeEcho = () => {
  window.Pusher = Pusher;

  return new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (
      channel: { name: string },
      _options: Record<string, unknown>
    ) => {
      return {
        authorize: (
          socketId: string,
          callback: (error: boolean, data: any) => void
        ) => {
          axios
            .post("/api/broadcasting/auth", {
              socket_id: socketId,
              channel_name: channel.name,
            })
            .then((response) => {
              callback(false, response.data);
            })
            .catch((error) => {
              callback(true, error);
            });
        },
      };
    },
  });
};

const echo = initializeEcho();

export default echo;
