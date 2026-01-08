import configJson from "./config.json";

export const backendUrl: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  configJson.backendUrl;
