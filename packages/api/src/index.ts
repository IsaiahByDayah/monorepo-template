import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "./routers"

export { createContext } from "./context"
export { appRouter, type AppRouter } from "./routers"

export type Inputs = inferRouterInputs<AppRouter>
export type Outputs = inferRouterOutputs<AppRouter>
