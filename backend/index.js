const env = require("./src/config/env");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./src/routes/index");
const centrErrorHandler = require("./src/middlewares/centrErrorHandler");

const app = express();

app.use(cors());

// Stripe Webhook needs raw body
const paymentCtrl = require("./src/modules/orders/payment.controller");
app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentCtrl.stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", router);

// Default Route
app.get("/status", (req, res) => res.send("E-commerce API is running"));

// Error Handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  next(err);
});

app.use(centrErrorHandler);

const port = env.PORT;
app.listen(port, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${port}`);
});
