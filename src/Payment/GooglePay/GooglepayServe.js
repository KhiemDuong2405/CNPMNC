require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/processGooglePay", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Thiếu token thanh toán" });
    }

    return res.json({ success: true, transactionId: "fake_txn_123456" });
  } catch (error) {
    console.error("Lỗi xử lý thanh toán:", error);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server đang chạy taị cổng ${PORT}`);
});
