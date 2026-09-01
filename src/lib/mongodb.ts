import "server-only"

import mongoose from "mongoose"

type MongooseCache = {
  connection: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongooseCache: MongooseCache | undefined
}

const cache = global._mongooseCache ?? {
  connection: null,
  promise: null,
}

global._mongooseCache = cache

export async function connectMongo() {
  if (cache.connection) {
    return cache.connection
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("MONGODB_URI is not configured")
  }

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
  })

  try {
    cache.connection = await cache.promise
  } catch (error) {
    cache.promise = null
    throw error
  }

  return cache.connection
}
