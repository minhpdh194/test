/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_BOT_URL: string;
  readonly VITE_RECEIVER_WALLET_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
