import React, { useState, useEffect } from 'react';
import { database } from '../../API/firebaseconfig';
import { ref, set, update, remove, onValue, get } from "firebase/database";
import './QuanLiChuyenDi.css';

function QuanLiChuyenDi() {
  const [routes, setRoutes] = useState([]); // Danh sách tuyến đường
  const [licensePlates, setLicensePlates] = useState([]); // Danh sách biển số xe
  const [trips, setTrips] = useState([]); // Danh sách chuyến đi
  const [tripData, setTripData] = useState({
    date: '',
    from: '',
    to: '',
    timedi: '',
    idxe: '',
  });
  const [selectedRoute, setSelectedRoute] = useState(null); // Tuyến đường được chọn
  const [isEditMode, setIsEditMode] = useState(false); // Chế độ chỉnh sửa
  const [editTripPath, setEditTripPath] = useState(null); // Đường dẫn Firebase của chuyến đang chỉnh sửa
  const [minDate, setMinDate] = useState(''); // Ngày nhỏ nhất có thể chọn

// Kiểm tra nếu biển số xe đã được sử dụng cho tuyến khác trong ngày
const isLicensePlateInUseForDay = async (date, idxe) => {
  const tripsRef = ref(database, `Trips/${date}`);
  const snapshot = await get(tripsRef);

  if (snapshot.exists()) {
    const tripsOnDate = snapshot.val();
    // Duyệt qua tất cả các chuyến trong ngày để kiểm tra biển số xe
    for (const from in tripsOnDate) {
      for (const to in tripsOnDate[from]) {
        for (const time in tripsOnDate[from][to]) {
          if (tripsOnDate[from][to][time].idxe === idxe) {
            return true; // Biển số xe đã được sử dụng
          }
        }
      }
    }
  }
  return false; // Biển số xe chưa được sử dụng
};

  // Thiết lập ngày hiện tại cho `minDate`
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2); 
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  // Tải danh sách tuyến đường từ Firebase
  useEffect(() => {
    const routesRef = ref(database, 'routes/');
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      const routesArray = [];
      if (data) {
        Object.keys(data).forEach(from => {
          Object.keys(data[from]).forEach(to => {
            Object.keys(data[from][to]).forEach(type => {
              routesArray.push({ from, to, type, ...data[from][to][type] });
            });
          });
        });
      }
      setRoutes(routesArray);
    });
  }, []);

  // Tải danh sách chuyến đi từ Firebase
  useEffect(() => {
    const tripsRef = ref(database, 'Trips/');
    onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      const tripsArray = [];
      if (data) {
        Object.keys(data).forEach(date => {
          Object.keys(data[date]).forEach(from => {
            Object.keys(data[date][from]).forEach(to => {
              Object.keys(data[date][from][to]).forEach(timedi => {
                const [time, type] = timedi.split('_'); 
                tripsArray.push({
                  date,
                  from,
                  to,
                  timedi: time,
                  type,
                  ...data[date][from][to][timedi]
                });
              });
            });
          });
        });
      }
      setTrips(tripsArray);
    });
  }, []);
  

  // Tải danh sách biển số xe từ Firebase
  useEffect(() => {
    const platesRef = ref(database, 'licensePlates/');
    onValue(platesRef, (snapshot) => {
      const data = snapshot.val();
      const platesArray = [];
      if (data) {
        Object.keys(data).forEach(plate => {
          platesArray.push({
            plate,
            type: data[plate].vehicleType,
            needsMaintenance: data[plate].needsMaintenance,
            isActive: data[plate].isActive
          });
        });
      }
      setLicensePlates(platesArray);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const handleRouteSelect = (e) => {
    const selectedRouteIndex = e.target.value;
    if (selectedRouteIndex !== "") {
      const route = routes[selectedRouteIndex];
      setSelectedRoute(route);
      setTripData({
        ...tripData,
        from: route.from,
        to: route.to,
        idxe: ""
      });
    }
  };

  // Tính toán thời gian đến
  const calculateArrivalTime = (timedi, duration) => {
    const [depHours, depMinutes] = timedi.split(':').map(Number);
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

  // Thêm phút vào thời gian hiện tại
  const addTime = (time, minutesToAdd) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  // Xử lý tạo chuyến đi khứ hồi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, idxe } = tripData;
  
    if (!selectedRoute || !date || !idxe) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    // Kiểm tra nếu biển số xe đã được sử dụng trong ngày
    const isInUse = await isLicensePlateInUseForDay(date, idxe);
    if (isInUse) {
      alert(`Biển số xe ${idxe} đã được sử dụng cho tuyến khác trong ngày ${date}.`);
      return; // Dừng nếu biển số xe đã được sử dụng
    }
  
    const { from, to, distance, duration, type, price } = selectedRoute;
    const turnAroundTime = 30; // Thời gian nghỉ giữa các chuyến khứ hồi, tính bằng phút
    
    let currentTimedi = "08:00"; // Giờ khởi hành ban đầu
    let currentFrom = from;
    let currentTo = to;
    let tripCount = 0;
  
    while (currentTimedi < "22:00") {
      const currentTimeden = calculateArrivalTime(currentTimedi, duration);
  
      const tripRefPath = `Trips/${date}/${currentFrom}/${currentTo}/${currentTimedi}_${type}`;
      const tripRef = ref(database, tripRefPath);
      const seatData = generateSeatData();
      await set(tripRef, { 
        timedi: currentTimedi, 
        timeden: currentTimeden, 
        distance, 
        duration, 
        idxe, 
        price, 
        type, 
        seats: seatData 
      });
  
      // Đổi điểm đi và điểm đến cho chuyến tiếp theo
      [currentFrom, currentTo] = [currentTo, currentFrom];
      currentTimedi = addTime(currentTimeden, turnAroundTime);
      tripCount++;
    }
  
    alert(`Tạo thành công ${tripCount} chuyến đi khứ hồi cho biển số ${idxe}.`);
  
    // Reset form và trạng thái
    setTripData({ date: '', from: '', to: '', timedi: '', idxe: '' });
    setSelectedRoute(null);
  };
  
  // Xử lý xóa chuyến đi
const handleDelete = async (trip) => {
  const tripRefPath = `Trips/${trip.date}/${trip.from}/${trip.to}/${trip.timedi}_${trip.type}`;
  const tripRef = ref(database, tripRefPath);

  try {
    await remove(tripRef);

    // Nếu bạn muốn cập nhật danh sách biển số xe sau khi xóa
    const plateRef = ref(database, `licensePlates/${trip.idxe}`);
    await update(plateRef, { isActive: true });

    alert("Chuyến đi đã được xóa thành công.");
  } catch (error) {
    console.error("Lỗi khi xóa chuyến đi:", error);
  }
};

// Xử lý chỉnh sửa chuyến đi
const handleEdit = (trip) => {
  setTripData({
    date: trip.date,
    from: trip.from,
    to: trip.to,
    timedi: trip.timedi,
    idxe: trip.idxe,
  });
  setSelectedRoute(routes.find(route => route.from === trip.from && route.to === trip.to && route.type === trip.type));
  setIsEditMode(true);
  setEditTripPath(`Trips/${trip.date}/${trip.from}/${trip.to}/${trip.timedi}_${trip.type}`);
};


  // Tạo dữ liệu ghế ngồi
  const generateSeatData = () => {
    const seatData = {};
    for (let i = 1; i <= 18; i++) {
      seatData[`A${String(i).padStart(2, '0')}`] = false;
      seatData[`B${String(i).padStart(2, '0')}`] = false;
    }
    return seatData;
  };

  return (
    <div className="quan-li">
      <h2>Quản Lý Chuyến Đi</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={handleRouteSelect} required>
          <option value="">Chọn tuyến đường</option>
          {routes.map((route, index) => (
            <option key={index} value={index}>
              {route.from} - {route.to} ({route.type})
            </option>
          ))}
        </select>

        <input 
          type="date" 
          name="date" 
          value={tripData.date} 
          onChange={handleInputChange} 
          min={minDate}
          required 
        />

        <select name="idxe" value={tripData.idxe} onChange={handleInputChange} required>
          <option value="">Chọn biển số xe</option>
          {selectedRoute &&
            licensePlates
              .filter(license => 
                license.type === selectedRoute.type &&
                !license.needsMaintenance && 
                license.isActive 
              )
              .map((license, index) => (
                <option key={index} value={license.plate}>
                  {license.plate}
                </option>
              ))
          }
        </select>

        <button type="submit">{isEditMode ? "Cập Nhật Chuyến Đi" : "Thêm Chuyến Đi"}</button>
      </form>

      <h3>Danh Sách Chuyến Đi</h3>
      <table>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Điểm đi</th>
            <th>Điểm đến</th>
            <th>Loại xe</th>
            <th>Giờ khởi hành</th>
            <th>Biển số xe</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.date}</td>
              <td>{trip.from}</td>
              <td>{trip.to}</td>
              <td>{trip.type}</td>
              <td>{trip.timedi}</td>
              <td>{trip.idxe}</td>
              <td>
                <button onClick={() => handleEdit(trip)}>Sửa</button>
                <button onClick={() => handleDelete(trip)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLiChuyenDi;
