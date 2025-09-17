/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  strictImportEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTHDOMAIN: string;
  readonly VITE_FIREBASE_PROJECTID: string;
  readonly VITE_FIREBASE_STORAGEBUCKET: string;
  readonly VITE_FIREBASE_MESSAGINGSENDERID: string;
  readonly VITE_FIREBASE_APPID: string;
  readonly VITE_FIREBASE_MEASUREMENTID: string;
  readonly VITE_ALGOLIA_ID: string;
  readonly VITE_ALGOLIA_API_KEY: string;
  readonly VITE_RECAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
