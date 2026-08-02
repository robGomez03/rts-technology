/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL que recibe el POST del formulario de contacto. Si no se define, el
   * formulario cae al modo `mailto:`. Ver README.
   */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
