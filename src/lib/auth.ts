import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

const uri = process.env.MONGODB_URI!;

declare global {
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "Papertrail",
  advanced: {
    database: {
      joins: true,
    },
  },
  database: mongodbAdapter(db, {
    // Disable multi-document transactions to avoid MongoTransactionError on standalone MongoDB or during index creation
    transaction: false,
  }),

  plugins: [nextCookies()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "employee",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
});
