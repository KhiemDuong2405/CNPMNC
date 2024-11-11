import React, { useState, useEffect } from 'react';
import { database } from '../../API/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import './quanlikhachhang.css';

function QuanLiKhachHang() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);

  // Fetch thông tin chuyến đi khi ứng dụng khởi động
  useEffect(() => {
    const tripRef = ref(database, `Trips/2024-11-07/TP Hồ Chí Minh/Tiền Giang/09:37_Giường`);
    onValue(tripRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTripDetails(data);
      }
      setLoadingTrip(false);
    }, () => {
      setLoadingTrip(false);
    });
  }, []);

  // Fetch thông tin khách hàng khi nhập số điện thoại
  const fetchCustomer = () => {
    setLoadingCustomer(true);
    const customerRef = ref(database, `Customers/${phoneNumber}`);
    onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCustomer({ phoneNumber, ...data });
      } else {
        setCustomer(null); // Nếu không tìm thấy khách hàng
      }
      setLoadingCustomer(false);
    });
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    if (phoneNumber) {
      fetchCustomer();
    }
  };

  return (
      <div className="quan-li-khach-hang">
        <h2>Quản Lý Khách Hàng</h2>

        {/* Tìm kiếm khách hàng theo số điện thoại */}
        <div className="search-bar">
          <label htmlFor="phoneNumber">Số Điện Thoại:</label>
          <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại để tìm kiếm"
          />
          <button onClick={handleSearch}>Tìm Kiếm</button>
        </div>

        {/* Hiển thị thông tin khách hàng */}
        {loadingCustomer ? (
            <p>Đang tải thông tin khách hàng...</p>
        ) : customer ? (
            <div>
              <h3>Thông Tin Khách Hàng</h3>
              <p><strong>Tên:</strong> {customer.name}</p>
              <p><strong>Số Điện Thoại:</strong> {customer.phoneNumber}</p>

              {/* Hiển thị số vé đã đặt nếu có */}
              {customer.bookings ? (
                  <div>
                    <h4>Vé đã đặt:</h4>
                    <ul>
                      {Object.keys(customer.bookings).map((bookingKey) => (
                          <li key={bookingKey}>
                            <strong>{bookingKey}</strong> - Ghế: {customer.bookings[bookingKey].seat}
                          </li>
                      ))}
                    </ul>
                  </div>
              ) : (
                  <p>Không có vé đã đặt.</p>
              )}
            </div>
        ) : phoneNumber && !loadingCustomer ? (
            <p>Không tìm thấy khách hàng với số điện thoại này.</p>
        ) : null}

        {/* Hiển thị thông tin chuyến đi */}
        <h3>Thông Tin Chuyến Đi</h3>
        {loadingTrip ? (
            <p>Đang tải thông tin chuyến đi...</p>
        ) : tripDetails ? (
            <div>
              <p><strong>Khoảng cách:</strong> {tripDetails.distance}</p>
              <p><strong>Thời gian:</strong> {tripDetails.duration}</p>
              <p><strong>Giá:</strong> {tripDetails.price} VND</p>
              <h4>Tình trạng Ghế:</h4>
              <div>
                {Object.keys(tripDetails.seats).map((seat) => (
                    <button
                        key={seat}
                        className={tripDetails.seats[seat] ? 'seat-booked' : 'seat-available'}
                    >
                      {seat}
                    </button>
                ))}
              </div>
            </div>
        ) : (
            <p>Không có thông tin chuyến đi.</p>
        )}
      </div>
  );
}

export default QuanLiKhachHang;
