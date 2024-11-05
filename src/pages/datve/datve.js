import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, push, update, set } from 'firebase/database';
import { database } from '../../API/firebaseconfig';
import './datve.css';

function ChonChuyen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTrip } = location.state || {}; 

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: 'N/A',
    email: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]); 

  const defaultSeats = Array.from({ length: 18 }, (_, i) => ({ id: `A${i + 1}`, sold: true }));

  const seats = {
    lower: selectedTrip?.seats 
      ? Object.keys(selectedTrip.seats)
          .filter((seatId) => seatId.startsWith("A"))
          .map((seatId) => ({
            id: seatId,
            sold: selectedTrip.seats[seatId],
          }))
      : defaultSeats,
    
    upper: selectedTrip?.seats 
      ? Object.keys(selectedTrip.seats)
          .filter((seatId) => seatId.startsWith("B"))
          .map((seatId) => ({
            id: seatId,
            sold: selectedTrip.seats[seatId],
          }))
      : defaultSeats,
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const formattedPhone = user.phoneNumber?.startsWith('+84')
          ? user.phoneNumber.replace('+84', '0')
          : user.phoneNumber || '';

        setCustomerInfo((prevInfo) => ({
          ...prevInfo,
          phone: formattedPhone,
        }));
      } 
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const toggleSeatSelection = (seat) => {
    if (!seat.sold) {
      setSelectedSeats((prevSeats) =>
        prevSeats.includes(seat.id)
          ? prevSeats.filter((s) => s !== seat.id)
          : [...prevSeats, seat.id]
      );
    }
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!acceptedTerms) {
      alert('Bạn cần chấp nhận điều khoản để tiếp tục.');
      return;
    }
  
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế.');
      return;
    }
  
    try {
      const phoneNumber = customerInfo.phone;
      const tripDate = selectedTrip.date;
      const from = selectedTrip.from;
      const to = selectedTrip.to;
      const busLicensePlate = selectedTrip.idxe;
      const tripPrice = selectedTrip.price * selectedSeats.length;
      const busType = selectedTrip.type;
  
      const bookingCode = generateRandomCode(); 
  
      const bookingData = {
        ghe: selectedSeats.join(','), 
        idxe: busLicensePlate,        
        price: tripPrice,             
        type: busType,                
        name: customerInfo.name,      
        date: tripDate,               
        from,                         
        to                           
      };
  
      const emailData = {
        ...bookingData,          
        phone: phoneNumber,      
        bookingCode              
      };
  
      const bookingRef = ref(database, `bookings/${phoneNumber}/${bookingCode}`);
      await set(bookingRef, bookingData);
  
      const seatsRef = ref(database, `Trips/${tripDate}/${from}/${to}/${selectedTrip.timedi}_${busType}/seats`);
      const updates = {};
      selectedSeats.forEach((seat) => {
        updates[`${seat}`] = true;
      });
      await update(seatsRef, updates);
  
      const response = await fetch('http://localhost:5001/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerInfo.email, bookingInfo: emailData }),
      });
  
      if (response.ok) {
        alert('Đặt vé thành công! Vé đã được gửi qua email.');
      } else {
        alert('Đặt vé thành công nhưng không thể gửi email.');
      }
  
      // Reset lại trạng thái
      setCustomerInfo({ name: '', phone: '', email: '' });
      setSelectedSeats([]);
      setAcceptedTerms(false);
      navigate('/');
  
    } catch (error) {
      console.error('Lỗi khi đặt vé:', error);
      alert('Đặt vé không thành công, vui lòng thử lại.');
    }
  };
  
  const subtractMinutes = (time, minutesToSubtract) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes - minutesToSubtract);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Lấy thời gian trừ 15 phút từ timedi
  const departureTimeAdjusted = selectedTrip?.timedi ? subtractMinutes(selectedTrip.timedi, 15) : 'N/A';

  return (
    <div className="chon-chuyen-container">
      <div className="chon-ghe">
        <h2>Chọn ghế</h2>
        {/* Thông tin hiển thị trạng thái các ghế */}
        <div className='seat-info'>
          <div className='seet-damua'>
            <div className='mau-da-mua'></div>
            <p>Đã mua</p>
          </div>
          <div className='seet-trong'>
            <div className='mau-ghe-trong'></div>
            <p>Còn trống</p>
          </div>
          <div className='seet-dangchon'>
            <div className='mau-dang-chon'></div>
            <p>Đang chọn</p>
          </div>
        </div>

        <h3>Tầng dưới</h3>
        <div className="seat-floor">
          {seats.lower.length > 0 ? (
            seats.lower.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.sold ? 'sold' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                onClick={() => toggleSeatSelection(seat)}
              >
                {seat.id}
              </div>
            ))
          ) : (
            <p>Không có ghế nào ở tầng dưới</p>
          )}
        </div>

        <h3>Tầng trên</h3>
        <div className="seat-floor">
          {seats.upper.length > 0 ? (
            seats.upper.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.sold ? 'sold' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                onClick={() => toggleSeatSelection(seat)}
              >
                {seat.id}
              </div>
            ))
          ) : (
            <p>Không có ghế nào ở tầng trên</p>
          )}
        </div>
      </div>

      <div className="thong-tin-luot-di">
        <h3>Thông tin lượt đi</h3>
        <ul>
          <li><strong>Tuyến xe:</strong> {selectedTrip ? `${selectedTrip.from} - ${selectedTrip.to}` : 'N/A'}</li>
          <li><strong>Thời gian xuất bến:</strong> {selectedTrip ? `${selectedTrip.timedi}` : 'N/A'}</li>
          <li><strong>Số lượng ghế:</strong> {selectedSeats.length}</li>
          <li><strong>Số ghế:</strong> {selectedSeats.join(', ')}</li>
        </ul>
        
        <h2>Thông tin đón trả</h2>
        <div className="pickup">
          <p className='pickdrop'>Điểm đón</p>
          <p className='diadiem'>{selectedTrip?.from ? `Bến xe ${selectedTrip.from}` : 'N/A'}</p>
        </div>
        <div className="dropoff">
          <p className='pickdrop'>Điểm trả</p>
          <p className='diadiem'>{selectedTrip?.to ? `Bến xe ${selectedTrip.to}` : 'N/A'}</p>
        </div>
        <div className="info">
          <p>
            Quý khách vui lòng có mặt tại <strong>{selectedTrip?.from ? `Bến xe ${selectedTrip.from}` : 'N/A'}</strong> trước <strong className="highlight-number">{departureTimeAdjusted}</strong>
          </p>
        </div>
        
        <h2>Thông tin khách hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <p>Số điện thoại</p>
            <p className="phone-display">{customerInfo.phone}</p>
          </div>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="terms" style={{ padding: 0 }}>
            <input
              type="checkbox"
              name="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <label>
              <span>Chấp nhận </span>
              <a href="">điều khoản</a>
            </label>
          </div>
          <div className="payment-section">
            <div className="payment-method">
              <span className="method-name">FUTAPAY</span>
              <span className="price">
                {selectedSeats.length > 0 
                  ? `${(selectedTrip?.price || 0) * selectedSeats.length}.000đ`
                  : '0đ'}
              </span>
            </div>
            <button 
              type="submit" 
              className={`submit-button ${acceptedTerms ? '' : 'disabled-button'}`} 
              disabled={!acceptedTerms}
            >
              Thanh toán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChonChuyen;
