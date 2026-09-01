import { ZodError } from "zod"

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
    public readonly code = "INTERNAL_ERROR",
    public readonly details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}

export async function readJson(request: Request) {
  try {
    return await request.json()
  } catch {
    throw new AppError("The request body must be valid JSON", 400, "INVALID_JSON")
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "The request data is invalid",
          details: error.flatten(),
        },
      },
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status }
    )
  }

  console.error(error)

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request",
      },
    },
    { status: 500 }
  )
}
