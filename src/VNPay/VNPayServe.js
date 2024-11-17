const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const qs = require('qs');
const moment = require('moment');
const config = require('./vnpayConfig');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/createVnpayOrder', (req, res) => {
    try {
        const { amount } = req.body;

        const createDate = moment().format('YYYYMMDDHHmmss');
        const orderId = moment().format('HHmmss');

        const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');

        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: config.vnp_TmnCode,
            vnp_Amount: amount,
            vnp_BankCode: "NCB",
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh+toan+don+hang+${orderId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: config.vnp_ReturnUrl,
            vnp_IpAddr: '172.0.0.1',
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate
        };

        const sortedParams = sortObject(params);

        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        sortedParams.vnp_SecureHash = signed;

        const vnpUrl = `${config.vnp_Url}?${qs.stringify(sortedParams, { encode: false })}`;

        // console.log("Url:", vnpUrl);

        res.json({ paymentUrl: vnpUrl });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng VNPay:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn hàng VNPay", error: error.message });
    }
});


function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

app.get('/api/vnpay_return', (req, res) => {
    const query = req.query;
    const secureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedQuery = sortObject(query);
    const signData = qs.stringify(sortedQuery, { encode: false });
    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
        if (query.vnp_ResponseCode === '00') {
            // Thanh toán thành công
            res.redirect(`/ketquathanhtoan?status=success&orderId=${query.vnp_TxnRef}`);
        } else {
            // Thanh toán không thành công
            res.redirect(`/ketquathanhtoan?status=failed&orderId=${query.vnp_TxnRef}`);
        }
    } else {
        res.redirect(`/ketquathanhtoan?status=failed&orderId=${query.vnp_TxnRef}`);
    }
});

const PORT = 3500;
app.listen(PORT, () => {
    console.log(`API VNPay đang chạy tại port ${PORT}`);
});
