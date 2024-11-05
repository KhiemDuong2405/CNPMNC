import React from 'react';
import './Footer.css';

// Import các ảnh
import CHPlayIcon from '../../assets/images/CHPlay.svg';
import AppStoreIcon from '../../assets/images/AppStore.svg';
import FacebookIcon from '../../assets/images/facebook.svg';
import YouTubeIcon from '../../assets/images/youtube.svg';

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="contact-info">
          <h3>TRUNG TÂM TỔNG ĐÀI & CSKH</h3>
          <h1 className="hotline">1900 6067</h1>
          <p>
            CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES <br />
            Địa chỉ: Số 01 Tô Hiến Thành, Phường 3, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam. <br />
            Email: <a href="mailto:hotro@futa.vn">hotro@futa.vn</a> <br />
            Điện thoại: 02838386852 <br />
            Fax: 02838386853
          </p>

          <h4>TẢI APP FUTA</h4>
          <div className="app-links">
            <img src={CHPlayIcon} alt="CH Play" className="app-icon" />
            <img src={AppStoreIcon} alt="App Store" className="app-icon" />
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>FUTA Bus Lines</h4>
            <ul>
              <li>Về chúng tôi</li>
              <li>Lịch trình</li>
              <li>Tuyển dụng</li>
              <li>Tin tức & Sự kiện</li>
              <li>Mạng lưới văn phòng</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Tra cứu thông tin đặt vé</li>
              <li>Điều khoản sử dụng</li>
              <li>Câu hỏi thường gặp</li>
              <li>Hướng dẫn đặt vé trên Web</li>
              <li>Hướng dẫn nạp tiền trên App</li>
            </ul>
          </div>
        </div>

        <div className="social-media">
          <h4>KẾT NỐI CHÚNG TÔI</h4>
          <div className="social-icons">
            <img src={FacebookIcon} alt="Facebook" className="social-icon" />
            <img src={YouTubeIcon} alt="YouTube" className="social-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
