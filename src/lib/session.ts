import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { AppError } from "@/lib/app-error"

export const getCurrentSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export async function requireSession() {
  const session = await getCurrentSession()

  if (!session) {
    throw new AppError("Authentication is required", 401, "UNAUTHORIZED")
  }

  return session
}
