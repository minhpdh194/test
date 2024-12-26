/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_BOT_URL: string;
  readonly VITE_RECEIVER_WALLET_ADDRESS: string;
  readonly VITE_PUSHER_APP_ID: string;
  readonly VITE_PUSHER_APP_KEY: string;
  readonly VITE_PUSHER_APP_SECRET: string;
  readonly VITE_PUSHER_APP_CLUSTER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
