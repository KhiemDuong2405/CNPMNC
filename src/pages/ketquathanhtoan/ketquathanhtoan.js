import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, set, update } from 'firebase/database';
import axios from 'axios';
import { database } from '../../API/firebaseconfig';

function KetQuaThanhToan() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transactionId, tripInfo, customerInfo, totalAmount, selectedPaymentMethod } = location.state || {};
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [message, setMessage] = useState('Đang xử lý quá trình thanh toán...');
    const [hasSaved, setHasSaved] = useState(false);  

    const saveTransactionToDatabase = async () => {
        if (hasSaved) return;  

        setHasSaved(true);  

        const bookingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const bookingData = {
            date: tripInfo?.searchDate || '',
            hour: tripInfo?.hour || '',
            from: tripInfo?.from || '',
            ghe: tripInfo?.seats.join(', ') || '',
            idxe: tripInfo?.busNumber || '',
            name: customerInfo?.name || '',
            price: totalAmount || 0,
            to: tripInfo?.to || '',
            type: tripInfo?.type || 'Ghế',
            transactionId,
            paymentMethod: selectedPaymentMethod,
            status: 'Thành công',
        };

        const infoUserBooking ={
            Email: customerInfo.email,
            Name: customerInfo.name
        }

        const emailData = {
            ...bookingData,
            phone: customerInfo.phone,
            bookingCode
        };

        try {
            const bookingRef = ref(database, `bookings/${customerInfo?.phone}/${bookingCode}`);
            await set(bookingRef, bookingData);

            const seatsRef = ref(database, `Trips/${bookingData.date}/${bookingData.from}/${bookingData.to}/${bookingData.hour}_${bookingData.type}/seats`);
            const updates = {};
            tripInfo.seats.forEach((seat) => {
                updates[`${seat}`] = true;
            });
            await update(seatsRef, updates);

            const infoUserRef = ref(database, `user/${customerInfo?.phone}`);
            await set(infoUserRef, infoUserBooking);

            const response = await fetch('http://localhost:5001/send-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: customerInfo.email, bookingInfo: emailData }),
            });

            if (response.ok) {
                setMessage('Thanh toán thành công. Vé của bạn đã được gửi qua Email, vui lòng kiểm tra Email');
            } else {
                setMessage('Thanh toán thành công nhưng không thể gửi email.');
            }

        } catch (error) {
            console.error("Lỗi khi lưu thông tin thanh toán:", error);
            setMessage('Có lỗi xảy ra khi lưu thông tin thanh toán. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`/api/payment-status/${transactionId}`);
                if (response.data.status === 'success' && !hasSaved) {
                    await saveTransactionToDatabase();
                    setPaymentStatus('success');
                } else if (response.data.status === 'failed') {
                    setPaymentStatus('failed');
                    setMessage("Thanh toán thất bại.");
                } else if (response.data.status === 'canceled') {
                    setPaymentStatus('canceled');
                    setMessage("Giao dịch đã bị hủy bởi người dùng.");
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
                setPaymentStatus('failed');
                setMessage("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán. Vui lòng thử lại.");
            }
        }, 3000);

        if (paymentStatus !== 'pending') {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [paymentStatus, hasSaved]);


    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: paymentStatus === 'success' ? '180px' : '230px' }}>
            <h2>{message}</h2>
            {paymentStatus !== 'pending' && (
                <button
                    onClick={handleReturnHome}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: paymentStatus === 'success' ? '#4CAF50' : '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Quay về trang chủ
                </button>
            )}
        </div>
    );
}

export default KetQuaThanhToan;
