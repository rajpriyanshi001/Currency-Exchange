const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/exchangeDB");

// Schema
const Exchange = mongoose.model("Exchange", {
  name: String,
  phone: String,
  upi: String,
  account: String,
  exchangeType: String,
  requestType: String,
  amount: Number,
  date: String
});

// API
app.post("/exchange", async (req, res) => {
  try {
    const data = req.body;

    await Exchange.create(data);

    // await axios.post("https://sukanyaasl.app.n8n.cloud/webhook-test/cash-change", data);

    res.json({ message: "Request submitted successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));