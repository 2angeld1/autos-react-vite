/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_ACCESS_TOKEN_KEY: string;
  readonly VITE_ENABLE_2FA: string;
  readonly VITE_ENABLE_REMEMBER_ME: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_IMAGE_TYPES: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}