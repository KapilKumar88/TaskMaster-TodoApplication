type AppConfig = {
  apiBaseUrl: string;
  appName: string;
};

const appConfig: AppConfig = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
}) as AppConfig;

export default appConfig;
