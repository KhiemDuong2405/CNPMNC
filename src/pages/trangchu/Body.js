import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { database } from '../../API/firebaseconfig';
import { ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import TawkTo from '../../API/ChatLive';

import 'swiper/css';
import 'swiper/css/pagination';
import './Body.css';
import webBanner from '../../assets/images/web.png';
import promotion1 from '../../assets/images/khuyenmai2.png';
import routeImage1 from '../../assets/images/anh2.png';
import routeImage2 from '../../assets/images/anh3.png';
import routeImage3 from '../../assets/images/anh1.png';
import statImage1 from '../../assets/images/Group.svg';
import statImage2 from '../../assets/images/Store.svg';
import statImage3 from '../../assets/images/Group_2.svg';
import newsImage1 from '../../assets/images/news1.png';
import newsImage2 from '../../assets/images/news2.png';
import newsImage3 from '../../assets/images/news3.png';
import serviceImage1 from '../../assets/images/ketnoi1.png';
import serviceImage2 from '../../assets/images/ketnoi2.png';
import serviceImage3 from '../../assets/images/ketnoi3.png';
import serviceImage4 from '../../assets/images/ketnoi4.png';
import illustration from '../../assets/images/image.svg';

const provinces = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 
  'Bắc Ninh', 'Bến Tre', 'Bình Dương', 'Bình Định', 'Bình Phước', 'Bình Thuận',
  'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 
  'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 
  'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 
  'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 
  'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 
  'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP Hồ Chí Minh', 
  'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

function Body() {  
  const [Trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState(1);
  const [showTicketSection, setShowTicketSection] = useState(false);
  const [tripsWithSeats, setTripsWithSeats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const tripsRef = ref(database, 'Trips/');
    onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      const tripsArray = [];
      if (data) {
        Object.keys(data).forEach(date => {
          Object.keys(data[date]).forEach(from => {
            Object.keys(data[date][from]).forEach(to => {
              Object.keys(data[date][from][to]).forEach(time => {
                const tripData = data[date][from][to][time];
                const availableSeats = countAvailableSeatsForTrip(tripData);
                tripsArray.push({
                  date,
                  from,
                  to,
                  timedi: time,
                  availableSeats, // Thêm số ghế trống
                  ...tripData
                });
              });
            });
          });
        });
      }
      setTripsWithSeats(tripsArray);
    });
  }, []);


  const handleSearch = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const matchedTrips = tripsWithSeats.filter(trip => {
      const [tripHours, tripMinutes] = trip.timedi.split(":").map(Number);

      return (
          trip.from === from &&
          trip.to === to &&
          trip.date === date &&
          (tripHours > currentHours || (tripHours === currentHours && tripMinutes > currentMinutes))
      );
    });

    setFilteredTrips(matchedTrips);
    setShowTicketSection(true);
  };



  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const auth = getAuth();
  const handleChooseTrip = (trip) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/datve', { state: { selectedTrip: trip } });
      } else {
        alert("Bạn cần đăng nhập để đặt vé.");
        navigate('/login');
      }
    });
  };

  const countAvailableSeatsForTrip = (trip) => {
    if (!trip.seats) return 0;
    return Object.values(trip.seats).filter(seat => seat === false).length;
  };
  
  const calculateArrivalTime = (departureTime, duration) => {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    
    const durationParts = duration.match(/(\d+)\s*giờ\s*(\d+)\s*phút/);
    
    if (!durationParts) {
        console.error('Invalid duration format:', duration);
        return 'Invalid Time'; 
    }
    
    const durHours = parseInt(durationParts[1], 10);
    const durMinutes = parseInt(durationParts[2], 10);
    
    let totalMinutes = depHours * 60 + depMinutes + durHours * 60 + durMinutes;

    const arrivalHours = Math.floor(totalMinutes / 60) % 24; 
    const arrivalMinutes = totalMinutes % 60;

    return `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`;
};


  return (
    <div>
      <div className="banner">
        <img src={webBanner} alt="Banner" className="banner-image" />
      </div>

      <div className="search-form-container">
        <div className="search-form">
          <div className="form-row">
            <div className="form-group">
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">Chọn điểm đi</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="">Chọn điểm đến</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="date"
                id="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
            </div>
          </div>
          <button className="search-button" onClick={handleSearch}>Tìm chuyến xe</button>
        </div>
      </div>
      
      {showTicketSection && (
        <div className='show-ticket-section'>
          <div className='loc-section'>
            <div className='loc-section-title'>
              <p>BỘ LỌC TÌM KIẾM</p>
              <p className='cancel-loc'>Bỏ lọc</p>
            </div>

            <div className='loc-section-content'>
              <p>Giờ đi</p>
              <div className='check-loc'>
                <input type="checkbox" id="earlyMorning" name="time" value="earlyMorning" />
                <label htmlFor="earlyMorning">Sáng sớm 00:00 - 06:00</label>
              </div>
              <div className='check-loc'>
                <input type="checkbox" id="morning" name="time" value="morning" />
                <label htmlFor="morning">Buổi sáng 06:00 - 12:00</label>
              </div>
              <div className='check-loc'>
                <input type="checkbox" id="afternoon" name="time" value="afternoon" />
                <label htmlFor="afternoon">Buổi chiều 12:00 - 18:00</label>
              </div>
              <div className='check-loc'>
                <input type="checkbox" id="evening" name="time" value="evening" />
                <label htmlFor="evening">Buổi tối 18:00 - 24:00</label>
              </div>
              <div>
                <p>Loại ghế</p>
                <div className='loai-ghe'>
                  <button type="button">Ghế</button>
                  <button type="button">Giường</button>
                  <button type="button">Limousine</button>
                </div>
              </div>
            </div>
          </div>

          <div className='ketqua-section'>
            <p>Kết quả tìm kiếm</p>
            
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, index) => {
                const arrivalTime = calculateArrivalTime(trip.timedi, trip.duration); 

                return (
                  <div key={index} className='ketqua-section-content'>
                    <div className='co-ketqua'>
                      <div className="ticket-card">
                        <div className="ticket-info">
                          <div className="time-location">
                            <div className="departure">
                              <span className='timedi'>{trip.timedi}</span>
                              <span className="location">{trip.from}</span>
                            </div>
                            <div className='duration-class'>
                              <img src='https://futabus.vn/images/icons/pickup.svg' alt="pickup icon" />
                              <div className='line'></div>
                            </div>
                            <div className="duration">
                              <span className='gio'>{trip.duration}</span>
                              <span>(Asian/Ho Chi Minh)</span>
                            </div>
                            <div className='duration-class'>
                              <div className='line'></div>
                              <img src='https://futabus.vn/images/icons/station.svg' alt="station icon" />
                            </div>
                            <div className="arrival">
                              <span className='timeden'>{arrivalTime}</span>  
                              <span className="location">{trip.to}</span>
                            </div>
                          </div>
                          <div className="bus-info">
                            <div>
                              <span className="type">{trip.type}</span>
                              <div className="circle"></div>
                              <span className="seats">{trip.availableSeats} chỗ trống</span>
                              <div className="circle"></div>
                              <span className="price">{trip.price}</span>
                            </div>
                            <button className="choose-btn" onClick={() => handleChooseTrip(trip)}>Chọn chuyến</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='khong-ketqua'>
                <img src='https://futabus.vn/images/empty_list.svg' alt="No result" />
                <p>Không có kết quả được tìm thấy</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="promotions-section">
        <h2>KHUYẾN MÃI NỔI BẬT</h2>
        <Swiper spaceBetween={30} slidesPerView={3} loop={true} pagination={{ clickable: true }} modules={[Pagination]}>
          <SwiperSlide>
            <img src={promotion1} alt="Promotion 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={promotion1} alt="Promotion 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={promotion1} alt="Promotion 3" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="popular-routes1">
        <div className="popular-routes">
          <h2>TUYẾN PHỔ BIẾN</h2>
          <p>Được khách hàng tin tưởng và lựa chọn</p>
          <div className="route-cards">
            {/* Card 1 */}
            <div className="route-card">
              <img src={routeImage1} alt="Tuyến xe từ Tp Hồ Chí Minh" className="route-card-image" />
              <div className="route-card-body">
                <h3>Tuyến xe từ Tp Hồ Chí Minh</h3>
                <ul>
                  <li>
                    Đà Lạt<br />
                    <span>305km - 8 giờ - 01/10/2024</span> <span className="price">290.000đ</span>
                  </li>
                  <li>
                    Cần Thơ<br />
                    <span>166km - 3 giờ 12 phút - 01/10/2024</span> <span className="price">165.000đ</span>
                  </li>
                  <li>
                    Long Xuyên<br />
                    <span>203km - 5 giờ - 01/10/2024</span> <span className="price">190.000đ</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Card 2 */}
            <div className="route-card">
              <img src={routeImage2} alt="Tuyến xe từ Đà Lạt" className="route-card-image" />
              <div className="route-card-body">
                <h3>Tuyến xe từ Đà Lạt</h3>
                <ul>
                  <li>
                    TP. Hồ Chí Minh<br />
                    <span>310km - 8 giờ - 01/10/2024</span> <span className="price">290.000đ</span>
                  </li>
                  <li>
                    Đà Nẵng<br />
                    <span>757km - 17 giờ - 01/10/2024</span> <span className="price">410.000đ</span>
                  </li>
                  <li>
                    Cần Thơ<br />
                    <span>457km - 11 giờ - 01/10/2024</span> <span className="price">435.000đ</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Card 3 */}
            <div className="route-card">
              <img src={routeImage3} alt="Tuyến xe từ Đà Nẵng" className="route-card-image" />
              <div className="route-card-body">
                <h3>Tuyến xe từ Đà Nẵng</h3>
                <ul>
                  <li>
                    Đà Lạt<br />
                    <span>666km - 17 giờ - 01/10/2024</span> <span className="price">410.000đ</span>
                  </li>
                  <li>
                    BX An Sương<br />
                    <span>966km - 20 giờ - 01/10/2024</span> <span className="price">410.000đ</span>
                  </li>
                  <li>
                    Nha Trang<br />
                    <span>528km - 9 giờ 25 phút - 01/10/2024</span> <span className="price">300.000đ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="statistics-section">
        <div className="statistics-container">
          <h2>FUTA BUS LINES - CHẤT LƯỢNG LÀ DANH DỰ</h2>
          <p>Được khách hàng tin tưởng và lựa chọn</p>

          <div className="statistics-items">
            {/* Item 1 */}
            <div className="stat-item">
              <img src={statImage1} alt="Luot khach" className="stat-icon" />
              <div className="stat-text">
                <h3>Hơn 20 Triệu</h3>
                <p>Phương Trang phục vụ hơn 20 triệu lượt khách bình quân 1 năm trên toàn quốc</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="stat-item">
              <img src={statImage2} alt="Phong ve" className="stat-icon" />
              <div className="stat-text">
                <h3>Hơn 350</h3>
                <p>Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,... trên toàn hệ thống</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="stat-item">
              <img src={statImage3} alt="Chuyen xe" className="stat-icon" />
              <div className="stat-text">
                <h3>Hơn 1,000</h3>
                <p>Phương Trang phục vụ hơn 1,000 chuyến xe đường dài và liên tỉnh mỗi ngày</p>
              </div>
            </div>
          </div>
        </div>

        <div className="illustration-container">
          <img src={illustration} alt="FUTA illustration" className="illustration-image" />
        </div>
      </div>

      <div className="news-section">
        <div className="news-header">
          <h2>TIN TỨC MỚI</h2>
          <a href="/all-news" className="view-all">Xem tất cả</a>
        </div>
        <Swiper spaceBetween={20} slidesPerView={3} loop={true} pagination={{ clickable: true }} modules={[Pagination]}>
          <SwiperSlide>
            <div className="news-card">
              <img src={newsImage1} alt="News 1" className="news-image" />
              <div className="news-details">
                <h3>PHƯƠNG TRANG - FUTA BUS LINES THÔNG BÁO THAY ĐỔI SỐ TỔNG ĐÀI ĐẶT VÉ KHU VỰC NAM...</h3>
                <p>28/09/2024</p>
                <a href="/news-detail/1" className="news-link">Chi tiết &gt;</a>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="news-card">
              <img src={newsImage2} alt="News 2" className="news-image" />
              <div className="news-details">
                <h3>PHƯƠNG TRANG - FUTA BUS LINES KHAI TRƯƠNG VĂN PHÒNG HÒN ĐẤT - KIÊN GIANG</h3>
                <p>27/09/2024</p>
                <a href="/news-detail/2" className="news-link">Chi tiết &gt;</a>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="news-card">
              <img src={newsImage3} alt="News 3" className="news-image" />
              <div className="news-details">
                <h3>PHƯƠNG TRANG – FUTA BUS LINES KHAI TRƯƠNG VĂN PHÒNG KON TUM</h3>
                <p>26/09/2024</p>
                <a href="/news-detail/3" className="news-link">Chi tiết &gt;</a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="futa-group-section">
        <h2>KẾT NỐI FUTA GROUP</h2>
        <p>Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng...</p>
        <div className="services">
          <div className="service-item">
            <img src={serviceImage1} alt="Xe Hợp Đồng" />
          </div>
          <div className="service-item">
            <img src={serviceImage2} alt="Mua vé Phương Trang" />
          </div>
          <div className="service-item">
            <img src={serviceImage3} alt="Giao Hàng" />
          </div>
          <div className="service-item">
            <img src={serviceImage4} alt="Xe Buýt" />
          </div>
        </div>
      </div>
      <TawkTo /> {/* Hiển thị chat live */}

    </div>
  );
}

export default Body;