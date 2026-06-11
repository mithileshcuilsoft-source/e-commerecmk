require("dotenv").config();
const zod = require("zod");

const envSchema = zod.object({
  PORT: zod.string().default("5000"),
  MONGO_URI: zod.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: zod.string().min(1, "JWT_SECRET is required"),
  STRIPE_SECRET_KEY: zod.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: zod.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  FRONTEND_URL: zod.string().url("FRONTEND_URL must be a valid URL"),
  AWS_REGION: zod.string().optional(),
  AWS_ACCESS_KEY: zod.string().optional(),
  AWS_SECRET_KEY: zod.string().optional(),
  AWS_BUCKET_NAME: zod.string().optional(),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("development"),
});

const envVars = process.env;

const parsed = envSchema.safeParse(envVars);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

module.exports = parsed.data;
