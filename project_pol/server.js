const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: "rzp_test_RCgYGDZ5Qvvz2p",   // your key_id
  key_secret: "ToebIFnRGCPY1ISdlX0gEHB0" // your real key_secret
});

// 1. Create Order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// 2. Verify Payment
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
