const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(6, "Name must be at least 6 characters"),

  email: z
    .email("Invalid email")
    .toLowerCase(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  image: z.string()
  .optional(),

  role: z
    .enum(["admin", "vendor", "buyer"])
    .optional()
});

module.exports = registerSchema;