/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  strictImportEnv: unknown;
}

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
