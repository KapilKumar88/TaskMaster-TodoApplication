type AppConfig = {
  API_BASE_URL: string;
  APP_NAME: string;
};

const appConfig: AppConfig = Object.freeze({
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
}) as AppConfig;

export default appConfig;
