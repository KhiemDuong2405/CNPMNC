import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from '../../API/firebaseconfig';
import './thanhtoan.css';

function ThanhToan() {
    const location = useLocation();
    const navigate = useNavigate();
    const { tripInfo, customerInfo, pickupDropoff, totalAmount } = location.state || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ZaloPay');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [remainingTime, setRemainingTime] = useState(600);

    const paymentMethods = [
        { name: 'ZaloPay', icon: '/icon-zalopay.png' },
        { name: 'VNPay', icon: '/icon-vnpay.png' }
    ];

    const generateRandomCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

    const handlePaymentMethodChange = (method) => {
        console.log("Phương thức thanh toán đã thay đổi:", method.name);
        setSelectedPaymentMethod(method.name);
        setPaymentUrl('');
    };

    const handleConfirmPayment = async () => {
        try {
            const response = await axios.post('/api/createOrder', {
                amount: totalAmount * 1000,
                description: 'Thanh toán đơn hàng'
            });
            console.log("Phản hồi từ server:", response.data);
            console.log(response.data.order_url)
            const paymentLink = response.data.order_url || response.data.qrCodeUrl;

            if (paymentLink) {
                setPaymentUrl(paymentLink);
                window.location.href = paymentLink;
            } else {
                console.warn("Không nhận được URL thanh toán từ phản hồi của server.");
                alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo URL thanh toán:", error);
            alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
        }
    };

    const handlePaymentSuccess = async () => {
        const bookingCode = generateRandomCode();
        const bookingData = {
            date: tripInfo?.searchDate || '',
            hour: tripInfo?.hour || '',
            from: tripInfo?.from || '',
            ghe: tripInfo?.seats?.join(',') || '',
            idxe: tripInfo?.busNumber || '',
            name: customerInfo?.name || '',
            price: totalAmount || 0,
            to: tripInfo?.to || '',
            type: tripInfo?.type || 'Ghế',
        };

        try {
            console.log("Lưu thông tin thanh toán vào Firebase:", bookingData);
            const bookingRef = ref(database, `bookings/${customerInfo?.phone}/${bookingCode}`);
            await set(bookingRef, bookingData);
            alert('Thanh toán thành công! Bạn sẽ được chuyển về trang chủ.');
            navigate('/');
        } catch (error) {
            console.error("Lỗi khi lưu thông tin thanh toán:", error);
            alert('Có lỗi xảy ra khi lưu thông tin thanh toán. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    alert("Thời gian giữ chỗ đã hết. Bạn sẽ được chuyển về trang chủ.");
                    navigate('/');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                <button className="confirm-button" onClick={handleConfirmPayment}>Thực hiện thanh toán thanh toán
                </button>
            </div>

            <div className="trip-info">
                <h3>Thông tin hành khách</h3>
                <p>Họ và tên: <br/> {customerInfo?.name || ''}</p>
                <p>Số điện thoại: <br/> {customerInfo?.phone || ''}</p>
                <p>Email: <br/> {customerInfo?.email || ''}</p>
            </div>

            <div className="price-info">
                <h3>Chi tiết giá</h3>
                <p>Giá vé lượt đi <br/> {totalAmount ? `${totalAmount}.000đ` : ''}</p>
                <p>Phí thanh toán <br/> 0đ</p>
                <p className="total-line">Tổng tiền <br/> {totalAmount ? `${totalAmount}.000đ` : ''}</p>
            </div>

            <div className="trip-info">
                <h3>Thông tin lượt đi</h3>
                <p>Tuyến xe: <br/> {tripInfo ? `${tripInfo.from} - ${tripInfo.to}` : ''}</p>
                <p>Giờ xuất bến: {tripInfo?.hour || ''}</p>
                <p>Số lượng ghế: {tripInfo?.seatCount || ''}</p>
                <p>Mã ghế: {tripInfo?.seats?.join(', ') || ''}</p>
                <p>Điểm đón:<br/> {pickupDropoff?.pickup || ''}</p>
                <p>Điểm trả:<br/> {pickupDropoff?.dropoff || ''}</p>
            </div>

        </div>
    );
}

export default ThanhToan;
