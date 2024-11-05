import React, { useState } from 'react';
import './lienhe.css'; 
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom

function LienHe() {
  

  return (
    <div className="app">
  <div className="contact-section">
      <div className="contact-details">
        <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
        <h4>PHƯƠNG TRANG - FUTA BUS LINES</h4>
        <p><strong>Địa chỉ:</strong> Số 01 Tô Hiến Thành, Phường 3, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam</p>
        <p><strong>Website:</strong> <a href="https://futabus.vn/">https://futabus.vn</a></p>
        <p><strong>Điện thoại:</strong> 02838386852</p>
        <p><strong>Fax:</strong> 02838386853</p>
        <p><strong>Email:</strong> hotro@futa.vn</p>
        <p><strong>Hotline:</strong> 19006067</p>
      </div>
      <div className="contact-form">
        <h3>Gửi thông tin liên hệ đến chúng tôi</h3>
        <form>
          <div className="form-group">
            <select>
              <option value="FUTA BUS LINES">FUTA BUS LINES</option>
            </select>
            <input type="text" placeholder="Họ và tên" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Điện thoại" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Nhập Tiêu đề" />
            <textarea placeholder="Nhập ghi chú"></textarea>
          </div>
          <button type="submit">Gửi</button>
        </form>
        </div>
        </div>
        
      
      </div>
  );
}

export default LienHe;