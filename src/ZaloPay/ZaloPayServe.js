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
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    callback_url: "https://a7cc-113-172-94-250.ngrok-free.app/api/zalopay/callback",
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
        bank_code: "zalopayapp",
        callback_url: config.callback_url
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const response = await axios.post(config.endpoint, null, { params: order });
        if (response.data.order_url) {
            res.json({
                order_Url: response.data.order_url,
                app_trans_id: order.app_trans_id,
            });
        } else {
            res.status(500).json({ message: "Không có 'order_url' trong phản hồi từ ZaloPay." });
        }
    } catch (error) {
        res.status(500).json({ message: error.response ? error.response.data : 'Lỗi không xác định' });
    }
});

let paymentStatusMap = {};

app.post('/api/zalopay/callback', (req, res) => {
    let result = {};
    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;
        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            const dataJson = JSON.parse(dataStr);
            const transactionId = dataJson['app_trans_id'];
            console.log('Đơn hàng', transactionId, 'thanh toán thành công');

            paymentStatusMap[transactionId] = { status: 'success' };

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        result.return_code = 0;
        result.return_message = ex.message;
    }
    res.json(result);
});

app.get('/api/payment-status/:transactionId', (req, res) => {
    const transactionId = req.params.transactionId;
    const status = paymentStatusMap[transactionId] || { status: 'pending' };
    res.json(status);
});

app.listen(PORT, () => {
    console.log(`API ZaloPay đang chạy tại port ${PORT}`);
});
