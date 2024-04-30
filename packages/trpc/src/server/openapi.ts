import {
  generateOpenApiDocument,
  type GenerateOpenApiDocumentOptions,
  type OpenApiRouter,
} from "trpc-openapi"

import { appRouter } from "./routers"

export const generateOpenApiDocs = (
  options: GenerateOpenApiDocumentOptions,
): ReturnType<typeof generateOpenApiDocument> =>
  generateOpenApiDocument(appRouter as OpenApiRouter, options)
