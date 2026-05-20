const { z } = require("zod");

const variantOptionSchema = z.object({
  value: z.string().optional(),

  priceModifier: z.coerce
    .number()
    .min(0, "Price modifier cannot be negative")
    .optional(),

  stock: z.coerce
    .number()
    .min(0, "Stock cannot be negative")
    .optional(),
});

const variantSchema = z.object({
  name: z.string().optional(),

  options: z.array(variantOptionSchema).optional(),
});

const createProductSchema = z.object({
  name: z.string().optional(),

  description: z.string().optional(),

  category: z.string().optional(),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .optional(),

  stock: z.coerce
    .number()
    .min(0, "Stock cannot be negative")
    .optional(),

  vendorId: z.string().optional(),

  images: z.array(z.string()).optional(),

  variants: z.any().optional(),
});

module.exports = {
  createProductSchema,
};