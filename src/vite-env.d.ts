// FIX: The reference to "vite/client" was causing a type resolution error.
// As the application doesn't use any Vite-specific client APIs, this line has been removed to resolve the error.
// Added ambient type declaration for `process.env.API_KEY` to ensure type safety for its usage
// in `services/geminiService.ts`.
// FIX: To resolve the "Cannot redeclare block-scoped variable 'process'" error, this was changed to augment the global NodeJS.ProcessEnv interface. This correctly adds the `API_KEY` type to `process.env` without conflicting with existing global type definitions for `process`.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}
