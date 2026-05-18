const { z } = require("zod");

const orderItemSchema = z.object({
  productId: z.string(),

  quantity: z.number().min(1),

  price: z.number().min(0),

  variant: z.string().optional(),
});

const createOrderSchema = z.object({
  userId: z.string(),

  items: z.array(orderItemSchema),

  shippingAddress: z.string(),

  subtotal: z.number(),

  tax: z.number().optional(),

  shippingCost: z.number().optional(),

  discount: z.number().optional(),

  total: z.number(),

  paymentMethod: z.enum([
    "credit_card",
    "debit_card",
    "paypal",
    "cash_on_delivery",
  ]),

  notes: z.string().optional(),
});

module.exports = {
  createOrderSchema,
};