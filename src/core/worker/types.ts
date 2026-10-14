// src/core/worker/types.ts

import type { Bindings } from '../../db/client'

export type AppVariables = {
  user: { id: string; email: string; name: string; image?: string | null } | null
}

export type WorkerEnv = {
  Bindings: Bindings
  Variables: AppVariables
}