import React, { useState } from 'react';
import './tracuuve.css';
import ReCAPTCHA from "react-google-recaptcha";
import { database } from '../../API/firebaseconfig';
import { ref, get, child } from "firebase/database";

function TraCuuVe() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null); // Trạng thái để lưu thông tin vé
  const [notFoundMessage, setNotFoundMessage] = useState(""); // Trạng thái để lưu thông báo không tìm thấy

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("Captcha value:", value);
  };

  const handleLookup = async () => {
    setTicketInfo(null); // Xóa thông tin vé cũ mỗi khi tra cứu mới
    setNotFoundMessage(""); // Xóa thông báo không tìm thấy cũ
    if (!phoneNumber || !bookingCode) {
      alert("Vui lòng nhập số điện thoại và mã vé.");
      return;
    }
    if (!captchaValue) {
      alert("Vui lòng xác nhận Captcha.");
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `bookings/${phoneNumber}/${bookingCode}`));

      if (snapshot.exists()) {
        const ticketData = snapshot.val();
        setTicketInfo(ticketData); // Lưu thông tin vé vào trạng thái để hiển thị
        setNotFoundMessage(""); // Đảm bảo không có thông báo lỗi khi tìm thấy vé
      } else {
        setTicketInfo(null);
        setNotFoundMessage("Thông tin vé không được tìm thấy. Vui lòng kiểm tra lại số điện thoại và mã vé."); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Lỗi khi tra cứu dữ liệu từ Firebase:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
      <h2>TRA CỨU THÔNG TIN ĐẶT VÉ</h2>
      <input 
        type="text"
        placeholder="Vui lòng nhập số điện thoại"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className='input-sdt'
        style={{ width: "100%", padding: "10px", marginBottom: "10px"}}
      />
      <input
        type="text"
        placeholder="Vui lòng nhập mã vé"
        value={bookingCode}
        onChange={(e) => setBookingCode(e.target.value)}
        className='input-idve'
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <ReCAPTCHA
        className='recapcha'
        sitekey="6LdS-nQqAAAAAJVcHK0HtBwpCCasvZkEmMv5Zwk7"
        onChange={handleCaptchaChange}
      />
      <button onClick={handleLookup}
        style={{
          marginTop: "20px",
          padding: "12px 50px",
          backgroundColor: "#fdece5",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          color: "#f25c27",
          fontWeight: "bold",
          fontSize: "16px",
          textAlign: "center",
          marginBottom: "20px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        Tra cứu
      </button>
      
      {/* Hiển thị thông báo không tìm thấy nếu vé không tồn tại */}
      {notFoundMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{notFoundMessage}</p>
      )}

      {/* Hiển thị thông tin vé theo thứ tự yêu cầu nếu tìm thấy */}
      {ticketInfo && (
        <div className='thongtinve' style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(100px, 1fr))",
          gap: "10px",
          textAlign: "center",
        }}>
          <div style={{ padding: "10px" }}>
            <strong>Ngày:</strong> <p>{ticketInfo.date}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Giờ đi:</strong> <p>{ticketInfo.hour}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Từ:</strong> <p>{ticketInfo.from}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Đến:</strong> <p>{ticketInfo.to}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Biển số xe:</strong> <p>{ticketInfo.idxe}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Ghế:</strong> <p>{ticketInfo.ghe}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Hành khách:</strong> <p>{ticketInfo.name}</p>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>Giá:</strong> <p>{ticketInfo.price} VND</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraCuuVe;
