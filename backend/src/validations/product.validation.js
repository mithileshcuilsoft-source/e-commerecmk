const { z } = require("zod");

const variantOptionSchema = z.object({
  value: z.string().optional(),

  priceModifier: z.coerce.number().min(0).optional(),

  stock: z.coerce.number().min(0).optional(),
});

const variantSchema = z.object({
  name: z.string().optional(),

  options: z.array(variantOptionSchema).optional(),
});

const createProductSchema = z.object({
  name: z.string().min(2, "Product name required"),

  description: z.string().optional(),

  category: z.string().min(1, "Category required"),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  stock: z.coerce
    .number()
    .min(0, "Stock cannot be negative"),

  vendorId: z.string().optional(),

  images: z.array(z.string()).optional(),

  variants: z.any().optional(),
});

module.exports = {
  createProductSchema,
};