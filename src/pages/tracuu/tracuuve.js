import React, { useState } from 'react';
import './tracuuve.css'; 
import { Link } from 'react-router-dom'; 
import ReCAPTCHA from "react-google-recaptcha";

function TraCuuVe() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); 

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); 
    console.log("Captcha value:", value); 
  };

  const handleLookup = async () => {
    if (!phoneNumber || !ticketCode) {
      alert("Vui lòng nhập số điện thoại và mã vé.");
      return;
    }
    if (!captchaValue) {
      alert("Vui lòng xác nhận Captcha.");
      return;
    }

    // Gửi `captchaValue` đến server để xác minh reCAPTCHA
    try {
      const response = await fetch("/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaValue }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Thông tin đặt vé của bạn đang được tra cứu...");
      } else {
        alert("Xác minh reCAPTCHA thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xác minh reCAPTCHA:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h2>TRA CỨU THÔNG TIN ĐẶT VÉ</h2>
      <input
        type="text"
        placeholder="Vui lòng nhập số điện thoại"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className='input-info'
        style={{ width: "100%", padding: "10px", marginBottom: "10px"}}
      />
      <input
        type="text"
        placeholder="Vui lòng nhập mã vé"
        value={ticketCode}
        className='input-info'
        onChange={(e) => setTicketCode(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <ReCAPTCHA
        className='recapcha'
        sitekey="6LdS-nQqAAAAAJVcHK0HtBwpCCasvZkEmMv5Zwk7" // Thay bằng Site Key thực tế
        onChange={handleCaptchaChange} // Sử dụng hàm handleCaptchaChange đã chỉnh sửa
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

      <div className='thongtinve'>
        <div className='khongthongtin'>

        </div>
        <div className='cothongtin'>

        </div>
      </div>

    </div>
  );
}

export default TraCuuVe;
