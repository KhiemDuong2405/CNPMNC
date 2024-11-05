import React, { useState } from 'react';
import './vechungtoi.css'; 
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import futabusImg from '../../assets/images/futabus.png'; // Thay đổi đường dẫn
import citybusImg from '../../assets/images/xebus.png'; // Thay đổi đường dẫn
import reststopImg from '../../assets/images/tram dung-01.png'; // Thay đổi đường dẫn
import visionMissionImg from '../../assets/images/Artboard .png'; // Thay đổi đường dẫn

function VeChungToi() {
  

  return (
    <div className="app">
       <div className="container">
      {/* Section 1: PHƯƠNG TRANG */}
      <section className="section">
        <div className="content">
          <h1 className="section-title">PHƯƠNG TRANG</h1>
          <h2 className="section-subtitle">“Chất lượng là danh dự”</h2>
          <p className="section-text">
            Tập đoàn Phương Trang – FUTA Group được thành lập năm 2001. Với hoạt động kinh doanh chính trong lĩnh vực mua bán xe ô tô, vận tải hành khách, bất động sản và kinh doanh dịch vụ, Phương Trang dần trở thành cái tên quen thuộc đồng hành cùng người Việt trên mọi lĩnh vực.
          </p>
          <p className="section-text">
            Trải qua hơn 20 năm hình thành và phát triển đặt khách hàng là trọng tâm, chúng tôi tự hào trở thành doanh nghiệp vận tải nòng cốt đóng góp tích cực vào sự phát triển chung của ngành vận tải nói riêng và nền kinh tế đất nước nói chung. Luôn cải tiến mang đến chất lượng dịch vụ tối ưu nhất dành cho khách hàng, Công ty Phương Trang được ghi nhận qua nhiều giải thưởng danh giá như “Thương hiệu số 1 Việt Nam”, “Top 10 Thương hiệu nổi tiếng Việt Nam”, “Top 10 Dịch vụ hoàn hảo vì quyền lợi người tiêu dùng năm 2022”, “Top 10 Doanh nghiệp tiêu biểu Việt Nam”, “Top 10 thương hiệu, sản phẩm dịch vụ uy tín Việt Nam – ASEAN 2022”…
          </p>
        </div>
      </section>

      {/* Section 2: FUTA BUS LINES */}
      <section className="section1">
        <div className="content1">
          <h1 className="section-title1">FUTA BUS LINES</h1>
          <p className="section-text1">
            Tuân thủ phương châm “Chất lượng là danh dự” Công ty Cổ phần Xe khách Phương Trang – FUTA Bus Lines hiện đang khai thác hơn 350 phòng vé, trạm trung chuyển trên khắp cả nước, đội ngũ nhân sự vận hành lên đến 11.000 nhân viên. Chúng tôi sở hữu 4.500 đầu xe các loại, trong đó 2.000 xe giường nằm cao cấp, vận hành 144 tuyến xe liên tỉnh với 6.500 chuyến xe mỗi ngày.
          </p>
          <p className="section-text1">
            Thương hiệu Phương Trang - FUTA Bus Lines đã trở thành lựa chọn hàng đầu cho hàng triệu lượt Khách mỗi năm, không ngừng mở rộng hệ thống từ Nam vào Bắc, tạo ra một mạng lưới vận chuyển đồng bộ và hiệu quả.
          </p>
        </div>
        <img className="section-image" src={futabusImg} alt="FUTA Bus Lines Buses" />
      </section>
      <section className="section1">
        <div className="content1">
          <h1 className="section-title1">FUTA CITY BUS</h1>
          <p className="section-text1">
            FUTA City Bus, thành lập ngày 20/07/2022, là một phần quan trọng trong chiến lược phát triển bền vững của Tập đoàn Phương Trang – FUTA Group trong lĩnh vực vận tải hành khách công cộng. Với tầm nhìn tiên phong, FUTA City Bus đã đầu tư mạnh mẽ vào đội xe chất lượng cao, trang bị đầy đủ tiện nghi như máy lạnh, wifi miễn phí và được vận hành bởi đội ngũ lái xe, nhân viên chuyên nghiệp, giàu kinh nghiệm.
          </p>
          <p className="section-text1">
            Hiện nay, FUTA City Bus đã có mặt tại 14 tỉnh thành, bao gồm Đà Nẵng, Khánh Hòa, Ninh Thuận, Lâm Đồng, TP.HCM, An Giang, Đồng Tháp, Hậu Giang, Bến Tre, Vĩnh Long, và nhiều địa phương khác. Trong năm 2024, chúng tôi dự kiến khai trương hai tuyến buýt mới kết nối TP.HCM với Bình Dương và triển khai 17 tuyến buýt có trợ giá để kết nối với tuyến Metro số 1. Đồng thời, chúng tôi cũng sẽ tham gia đấu thầu các dự án xe buýt tại Bà Rịa – Vũng Tàu, Quảng Nam, Bến Tre, Huế – Quảng Trị, TP.HCM, và nhiều khu vực khác.
          </p>
          <p className="section-text1">
            Năm 2025, FUTA City Bus sẽ tiếp tục mở rộng quy mô hoạt động với kế hoạch tham gia đấu thầu tại các tỉnh Kiên Giang, Sóc Trăng, Cà Mau, Tiền Giang, Đồng Nai, Bình Dương, Bình Thuận và nhiều địa phương khác với mục tiêu đạt từ 50% đến 70%. Đặc biệt, chúng tôi sẽ tiên phong trong việc triển khai loại hình xe buýt xanh tại TP.HCM, nhằm tối ưu hóa nhu cầu đi lại của người dân, giảm thiểu phương tiện cá nhân và góp phần xây dựng hệ thống giao thông hiện đại, thân thiện với môi trường.
          </p>
        </div>
          <img className="section-image" src={citybusImg} alt="FUTA City Buses" />
      </section>
      <section className="section-horizontal">
        <div className="text-section1">
          <h1 className="section-title1">FUTA REST STOP</h1>
          <p className="section-text1">
            Hiểu được nhu cầu nghỉ ngơi, thư giãn của hành khách trên các hành trình dài qua nhiều tỉnh, thành phố, Công ty Phương Trang còn đầu tư vào hệ thống trạm dừng Phúc Lộc tại các khu vực trọng điểm như Tiền Giang, Lâm Đồng, Bến Tre, Vĩnh Long, Sóc Trăng... Hệ thống Trạm dừng Phúc Lộc được đầu tư toàn diện, đảm bảo phục vụ lượng lớn khách hàng 24/7.
          </p>
          <p className="section-text1">
            Các Trạm dừng Phúc Lộc mang đến nhiều món ăn hấp dẫn, phong phú, phù hợp với khẩu vị đa dạng của hành khách. Bên trong trạm dừng có các gian hàng đặc sản như trái cây theo mùa hoặc các loại bánh đặc trưng của từng vùng miền, nơi khách hàng có thể thưởng thức tại chỗ hoặc mua về làm quà cho người thân. Những nỗ lực này nhằm mang đến chuyến đi thoải mái và thư giãn cùng trải nghiệm dịch vụ tối ưu dành cho Khách hàng Phương Trang nói riêng và tất cả hành khách nói chung.
          </p>
        </div>
          <img className="section-image" src={reststopImg} alt="Phuc Loc Rest Stop" />
      </section>
      <section className="section-horizontal"> 
          <img className="section-image" src={visionMissionImg} alt="Vision and Mission Illustration" />
        <div className="text-section1">
          <h1 className="section-title1">TẦM NHÌN VÀ SỨ MỆNH</h1>
          <h3 className="section-subtitle1">BÁO ĐÁP TỔ QUỐC VÌ MỘT VIỆT NAM HÙNG CƯỜNG.</h3>
          <ul className="section-list">
            <li>Trở thành Tập Đoàn uy tín và chất lượng hàng đầu Việt Nam với cam kết:</li>
            <li>Tạo môi trường làm việc năng động, thân thiện.</li>
            <li>Phát triển tối lòng tin của khách hàng.</li>
            <li>Trở thành tập đoàn dẫn đầu chuyên nghiệp.</li>
          </ul>
          <p className="section-text1">
            Phương Trang luôn phấn đấu làm việc hiệu quả nhất, để luôn cống hiến, đóng góp hết sức mình vì một Việt Nam hùng cường.
          </p>
        </div>
      </section>
    </div>
    
      
  </div>
);
}

export default VeChungToi;