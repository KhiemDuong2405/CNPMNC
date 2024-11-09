const express = require('express');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const cors = require('cors');

const app = express();
const PORT = 4500;

app.use(cors());
app.use(express.json());

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

app.post('/api/createOrder', async (req, res) => {
    const { amount, description } = req.body;

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: "user123",
        app_time: Date.now(),
        item: JSON.stringify([{ "itemid": "001", "itemname": "Demo Product", "itemprice": amount, "itemquantity": 1 }]),
        embed_data: JSON.stringify({}),
        amount: amount,
        description: description || `Thanh toán đơn hàng #${transID}`,
        bank_code: "zalopayapp"
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const response = await axios.post(config.endpoint, null, { params: order });
        console.log("Phản hồi từ ZaloPay:", response.data);

        if (response.data.order_url) {
            res.json({ qrCodeUrl: response.data.order_url });
        } else {
            res.status(500).json({ message: "Không có 'order_url' trong phản hồi từ ZaloPay." });
        }
    } catch (error) {
        console.error("Lỗi từ ZaloPay:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: error.response ? error.response.data : 'Lỗi không xác định' });
    }
});

app.listen(PORT, () => {
    console.log(`ZaloPay API server đang chạy tại port ${PORT}`);
});
