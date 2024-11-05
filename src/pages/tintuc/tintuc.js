import React  from 'react';
import './tintuc.css'; // Import file CSS cho component
import newsIcon from '../../assets/images/news-icon.png'; // Cập nhật đường dẫn ảnh
import searchIcon from '../../assets/images/search.png';
import mainNews from '../../assets/images/main-news.jpg';
import news1 from '../../assets/images/new1.png';
import news2 from '../../assets/images/new2.png';
import news3 from '../../assets/images/new3.jpg';
import news4 from '../../assets/images/new4.png';
import news5 from '../../assets/images/new5.png';
import news6 from '../../assets/images/news6.png';
import news7 from '../../assets/images/news7.png';


function TinTuc() {
  return (
    <>
      <div className="body2-container">
        {/* Mục tin tức tổng hợp */}
        <div className="news-header">
          <img src={newsIcon} alt="Tin tức" className="news-icon" />
          <span className="news-title">Tin tức tổng hợp</span>
        </div>

        {/* Navigation Menu cho các loại tin tức */}
        <nav className="news-nav">
          <ul className="news-nav-list">
            <li className="news-nav-item">FUTA Bus Lines</li>
            <li className="news-nav-item">FUTA City Bus</li>
            <li className="news-nav-item">Khuyến mãi</li>
            <li className="news-nav-item">Giải thưởng</li>
            <li className="news-nav-item">Trạm Dừng</li>
          </ul>
        </nav>

        {/* Thanh tìm kiếm */}
        <div className="search-box">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input type="text" className="search-input" placeholder="Tìm kiếm tin tức" />
        </div>
      </div>

      {/* Phần tin tức nổi bật */}
      <div className="highlight-news-section">
        <h2 className="highlight-title">Tin tức nổi bật</h2>
        <div className="highlight-news-container">
          {/* Bài viết nổi bật */}
          <div className="main-news">
            <img src={mainNews} alt="Bài viết nổi bật" className="main-news-image" />
            <h3 className="main-news-title">FUTA ĐỒNG HÀNH CÙNG SHB - X3 QUÀ TẶNG</h3>
            <p className="main-news-time">14:35 26/07/2023</p>
          </div>

          {/* Các bài viết phụ */}
          <div className="other-news-grid">
            <div className="news-item">
              <img src={news1} alt="Tin tức 1" />
              <p>NÂNG CẤP DÒNG XE VIP 34 GIƯỜNG...</p>
              <span>09:30 04/10/2024</span>
            </div>
            <div className="news-item">
              <img src={news2} alt="Tin tức 2" />
              <p>ĐẾN PHAN RANG VỚI DÒNG XE KIM...</p>
              <span>14:56 03/10/2024</span>
            </div>
            <div className="news-item">
              <img src={news3} alt="Tin tức 3" />
              <p>KHUYẾN MÃI LÊN ĐẾN 50.000Đ KHI...</p>
              <span>09:31 03/10/2024</span>
            </div>
            <div className="news-item">
              <img src={news4} alt="Tin tức 4" />
              <p>PHƯƠNG TRANG - FUTA BUS LINES...</p>
              <span>08:29 03/10/2024</span>
            </div>
          </div>
        </div>

        {/* Phần "Tiêu điểm" nằm dưới highlight-news-container */}
        <div className="spotlight-item">
          <div className="spotlight-content">
            <h3>Tiêu điểm</h3>
            <p>FUTA City Bus</p>
          </div>
        </div>

        <div className="spotlight-news-grid">
          <div className="news-item">
            <img src={news7} alt="Tin tức 6" />
            <p>PHƯƠNG TRANG - ĐỒNG HÀNH CÙNG DOANH NGHIỆP XE BUÝT...</p>
            <span>15:15 26/07/2023</span>
          </div>
          <div className="news-item">
            <img src={news6} alt="Tin tức 7" />
            <p>MIỄN PHÍ VÉ XE BUÝT CHO HỌC SINH...</p>
            <span>14:55 26/07/2023</span>
          </div>
          <div className="news-item">
            <img src={news3} alt="Tin tức 8" />
            <p>KHUYẾN MÃI HẤP DẪN DÀNH CHO HÀNH KHÁCH...</p>
            <span>13:49 26/07/2023</span>
          </div>
        </div>
      </div>

      {/* Phần "Tất cả tin tức" */}
      <div className="all-news-section">
        <div className="all-news-title-container">
          <h2 className="all-news-title">Tất cả tin tức</h2>
          <div className="title-line"></div> {/* Dấu gạch màu xanh lá */}
        </div>
        <div className="all-news-container">
          <div className="news-item small">
            <img src={news1} alt="Tất cả tin tức 1" />
            <div className="news-content">
              <p className="news-headline">FUTA ĐỒNG HÀNH CÙNG SHB - X3 QUÀ TẶNG</p>
              <span className="news-time">14:35 26/07/2023</span>
            </div>
          </div>
          <div className="news-item small">
            <img src={news2} alt="Tất cả tin tức 2" />
            <div className="news-content">
              <p className="news-headline">NÂNG CẤP DÒNG XE VIP 34 GIƯỜNG PHÒNG CHO TUYẾN...</p>
              <span className="news-time">09:30 04/10/2024</span>
            </div>
          </div>
          <div className="news-item small">
            <img src={news3} alt="Tất cả tin tức 3" />
            <div className="news-content">
              <p className="news-headline">ĐẾN PHAN RANG VỚI DÒNG XE KIM CƯƠNG...</p>
              <span className="news-time">14:56 03/10/2024</span>
            </div>
          </div>
          <div className="news-item small">
            <img src={news4} alt="Tất cả tin tức 4" />
            <div className="news-content">
              <p className="news-headline">KHUYẾN MÃI LÊN ĐẾN 50.000Đ KHI MUA VÉ PHƯƠNG TRANG...</p>
              <span className="news-time">09:31 03/10/2024</span>
            </div>
          </div>
        </div>
        {/* Phân trang */}
        <div className="pagination">
            <button className="page-button">1</button>
            <button className="page-button">2</button>
            <button className="page-button ">3</button>
            <button className="page-button">4</button>
            <button className="page-button">5</button>
            <span className="page-button dots">...</span>
            <button className="page-button">33</button>
            <button className="page-button">34</button>
        </div>

      </div>
    </>
  );
}

export default TinTuc;
