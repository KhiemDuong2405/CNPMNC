import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './thanhtoan.css';

function ThanhToan() {
    const location = useLocation();
    const navigate = useNavigate();
    const { tripInfo, customerInfo, pickupDropoff, totalAmount} = location.state || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ZaloPay');
    const [paymentUrl, setPaymentUrl] = useState('');

    const paymentMethods = [
        { name: 'ZaloPay', icon: '/icon-zalopay.png' },
        { name: 'VNPay', icon: '/icon-vnpay.png' }
    ];

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method.name);
        setPaymentUrl('');
    };

    const formatPriceToString = (priceInt) => {
        return priceInt.toLocaleString('vi-VN'); // Định dạng số theo chuẩn Việt Nam
    };

    const handleConfirmPayment = async () => {
        try {
            let response;

            if (selectedPaymentMethod === 'ZaloPay') {
                    response = await axios.post('/api/createOrder', {
                    amount: totalAmount,
                    description: 'Thanh toán đơn hàng qua ZaloPay'
                });
            } else if (selectedPaymentMethod === 'VNPay') {
                response = await axios.post('http://localhost:3500/api/createVnpayOrder', {
                    amount: totalAmount * 1000,
                    orderInfo: 'Thanh+toán+đơn+hàng+VNPay'
                });
            }

            const paymentLink = response?.data?.paymentUrl || response?.data?.order_Url;

            if (paymentLink) {
                setPaymentUrl(paymentLink);
                window.open(paymentLink, '_blank');

                navigate('/ketquathanhtoan', {
                    state: {
                        transactionId: response.data.app_trans_id || response.data.orderId || null,
                        tripInfo: tripInfo || {},
                        customerInfo: customerInfo || {},
                        pickupDropoff: pickupDropoff || {},
                        totalAmount: totalAmount || 0,
                        selectedPaymentMethod: selectedPaymentMethod || '',
                    }
                });
            } else {
                alert("Không nhận được URL thanh toán từ phản hồi của server.");
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
        }
    };


    return (
        <div className="payment-container">
            <div className="payment-methods-section">
                <h2>Chọn phương thức thanh toán</h2>
                {paymentMethods.map((method) => (
                    <div key={method.name} className="payment-option">
                        <input
                            type="radio"
                            id={method.name}
                            name="paymentMethod"
                            value={method.name}
                            checked={selectedPaymentMethod === method.name}
                            onChange={() => handlePaymentMethodChange(method)}
                        />
                        <label htmlFor={method.name} className="payment-label">
                            <img src={method.icon} alt={`${method.name} logo`} className="payment-logo"/>
                            {method.name}
                        </label>
                    </div>
                ))}
                <button className="confirm-button" onClick={handleConfirmPayment}>
                    Thực hiện thanh toán
                </button>
            </div>

            <div className="trip-info info-details">
                <h3>Thông tin hành khách</h3>
                <p>Họ và tên: <br/> <span>{customerInfo?.name || ''}</span></p>
                <p>Số điện thoại: <br/> <span>{customerInfo?.phone || ''}</span></p>
                <p>Email: <br/> <span>{customerInfo?.email || ''}</span></p>
            </div>

            <div className="price-info info-details">
                <h3>Chi tiết giá</h3>
                <p>Giá vé lượt đi: <span>{totalAmount ? `${formatPriceToString(totalAmount)}đ` : ''}</span></p>
                <p>Phí thanh toán: <span>0đ</span></p>
                <p className="total-line">Tổng tiền: <span>{totalAmount ? `${formatPriceToString(totalAmount)}đ` : ''}</span></p>
            </div>

            <div className="trip-info info-details">
                <h3>Thông tin lượt đi</h3>
                <p>Tuyến xe: <br/> <span>{tripInfo ? `${tripInfo.from} - ${tripInfo.to}` : ''}</span></p>
                <p>Giờ xuất bến: <span>{tripInfo?.hour || ''}</span></p>
                <p>Số lượng ghế: <span>{tripInfo?.seatCount || ''}</span></p>
                <p>Mã ghế đặt: <br/> <span>{tripInfo?.seats?.join(', ') || ''}</span></p>
                <p>Điểm đón: <br/> <span>{pickupDropoff?.pickup || ''}</span></p>
                <p>Điểm trả: <br/> <span>{pickupDropoff?.dropoff || ''}</span></p>
            </div>
        </div>
    );
}

export default ThanhToan;
