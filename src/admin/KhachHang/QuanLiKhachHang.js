import React, { useState, useEffect } from 'react';
import { database } from '../../API/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import './quanlikhachhang.css';

function QuanLiKhachHang() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [allCustomers, setAllCustomers] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Tự động tải tất cả khách hàng khi component mount
  useEffect(() => {
    fetchCustomer(); // Tải tất cả khách hàng khi truy cập vào trang
  }, []);

  // Hàm fetch thông tin khách hàng
  const fetchCustomer = () => {
    setLoadingCustomer(true);
    setCustomer(null);         // Xóa dữ liệu khách hàng cũ
    setAllCustomers(null);      // Xóa dữ liệu tất cả khách hàng cũ
    setErrorMessage("");        // Reset thông báo lỗi

    if (phoneNumber) {
      // Truy vấn một khách hàng theo số điện thoại từ node `user`
      const customerRef = ref(database, `user/${phoneNumber}`);
      onValue(customerRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCustomer({ phoneNumber, ...data });
        } else {
          setErrorMessage("Không có thông tin khách hàng với số điện thoại này.");
        }
        setLoadingCustomer(false);
      }, (error) => {
        console.error("Lỗi khi truy xuất dữ liệu:", error);
        setLoadingCustomer(false);
        setErrorMessage("Lỗi khi truy xuất dữ liệu.");
      });
    } else {
      // Truy vấn tất cả khách hàng
      const allCustomersRef = ref(database, `user`);
      onValue(allCustomersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAllCustomers(Object.entries(data)); // Lưu danh sách tất cả khách hàng
        } else {
          setErrorMessage("Không có thông tin khách hàng.");
        }
        setLoadingCustomer(false);
      }, (error) => {
        console.error("Lỗi khi truy xuất dữ liệu:", error);
        setLoadingCustomer(false);
        setErrorMessage("Lỗi khi truy xuất dữ liệu.");
      });
    }
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchCustomer();
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

        {/* Hiển thị bảng thông tin khách hàng */}
        <h3>Danh Sách Khách Hàng</h3>
        {loadingCustomer ? (
            <p>Đang tải thông tin khách hàng...</p>
        ) : (
            <table className="customer-table">
              <thead>
              <tr>
                <th>STT</th>
                <th>Tên Khách Hàng</th>
                <th>Email</th>
                <th>Đăng nhập lần đầu</th>
                <th>Số Điện Thoại</th>
              </tr>
              </thead>
              <tbody>
              {customer ? (
                  <tr>
                    <td>1</td>
                    <td>{customer.Name}</td>
                    <td>{customer.Email}</td>
                    <td>{customer.firstLogin}</td>
                    <td>{customer.phoneNumber}</td>
                  </tr>
              ) : allCustomers && allCustomers.length > 0 ? (
                  allCustomers.map(([key, customerData], index) => (
                      <tr key={key}>
                        <td>{index + 1}</td>
                        <td>{customerData.Name}</td>
                        <td>{customerData.Email}</td>
                        <td>{customerData.firstLogin}</td>
                        <td>{key}</td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center'}}>
                      {errorMessage || "Không có thông tin khách hàng."}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
        )}
      </div>
  );
}

export default QuanLiKhachHang;
