import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "./routers"

export { createContext } from "./context"
export { generateOpenApiDocs } from "./openapi"
export { appRouter, openApiRouter, type AppRouter } from "./routers"

export type Inputs = inferRouterInputs<AppRouter>
export type Outputs = inferRouterOutputs<AppRouter>
