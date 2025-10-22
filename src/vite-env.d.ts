// FIX: The reference to "vite/client" was causing a type resolution error.
// As the application doesn't use any Vite-specific client APIs, this line has been removed to resolve the error.
// Added ambient type declaration for `process.env.API_KEY` to ensure type safety for its usage
// in `services/geminiService.ts`.
declare var process: {
  env: {
    API_KEY: string;
  };
};
