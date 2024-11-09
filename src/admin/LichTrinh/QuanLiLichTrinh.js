import React, { useState, useEffect } from 'react';
import './quanli.css';
import { database } from '../../API/firebaseconfig';
import { ref, set, remove, onValue } from "firebase/database";
import getCoordinates from '../../API/OpenCageAPI';

function QuanLiLichTrinh() {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    type: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

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
  const vehicleTypes = ["Ghế", "Giường", "Limousine"];

  useEffect(() => {
    const routesRef = ref(database, 'routes/');
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      const routesArray = data ? Object.keys(data).flatMap(from =>
        Object.keys(data[from]).flatMap(to =>
          Object.keys(data[from][to]).map(type => ({ from, to, type, ...data[from][to][type] }))
        )) : [];
      setRoutes(routesArray);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateDuration = (distance) => {
    const hours = Math.floor(distance / 50);
    const minutes = Math.round(((distance / 50) - hours) * 60);
    return `${hours} giờ ${minutes} phút`;
  };

  const calculatePrice = (distance, type) => {
    let price = 100000 + (distance > 30 ? (distance - 30) * 1000 : 0);
    if (type === "Giường") price += 30000;
    else if (type === "Limousine") price += 60000;
    return price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from, to, type } = formData;
  
    if (from === to) {
      alert("Điểm đi và điểm đến không được trùng nhau.");
      return;
    }
  
    const fromCoords = await getCoordinates(from);
    const toCoords = await getCoordinates(to);
    const distance = Math.round(calculateDistance(fromCoords, toCoords));
    const duration = calculateDuration(distance);
    const price = calculatePrice(distance, type);
  
    const routeRef = ref(database, `routes/${from}/${to}/${type}`);
    await set(routeRef, {
      type, distance: `${distance} km`, duration, price: price.toLocaleString('vi-VN'), from, to
    });
  
    setFormData({ from: '', to: '', type: '' });
    setIsEditing(false);
    setEditingRoute(null);
  };
  

  const handleEdit = (route) => {
    setFormData(route);
    setIsEditing(true);
    setEditingRoute(route);
  };

  const handleDelete = async (from, to, type) => {
    await remove(ref(database, `routes/${from}/${to}/${type}`));
    if (isEditing && editingRoute?.from === from && editingRoute?.to === to && editingRoute?.type === type) {
      setIsEditing(false);
      setEditingRoute(null);
      setFormData({ from: '', to: '', type: '' });
    }
  };

  return (
    <div className="quan-li">
      <h2>Quản Lý Lịch Trình</h2>
      
      <form onSubmit={handleSubmit}>
        <select name="from" value={formData.from} onChange={handleInputChange} required>
          <option value="">Chọn điểm đi</option>
          {provinces.map((province, index) => <option key={index} value={province}>{province}</option>)}
        </select>

        <select name="to" value={formData.to} onChange={handleInputChange} required>
          <option value="">Chọn điểm đến</option>
          {provinces.map((province, index) => <option key={index} value={province}>{province}</option>)}
        </select>

        <select name="type" value={formData.type} onChange={handleInputChange} required>
          <option value="">Chọn loại xe</option>
          {vehicleTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
        </select>

        <button type="submit">{isEditing ? "Cập Nhật Lịch Trình" : "Thêm Lịch Trình"}</button>
        {isEditing && (
          <button type="button" onClick={() => {
            setIsEditing(false);
            setEditingRoute(null);
            setFormData({ from: '', to: '', type: '' });
          }}>Hủy Chỉnh Sửa</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Từ</th>
            <th>Đến</th>
            <th>Loại xe</th>
            <th>Khoảng cách</th>
            <th>Thời gian</th>
            <th>Giá vé</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={`${route.from}-${route.to}-${route.type}`}>
              <td>{route.from}</td>
              <td>{route.to}</td>
              <td>{route.type}</td>
              <td>{route.distance}</td>
              <td>{route.duration}</td>
              <td>{route.price}</td>
              <td>
                <button onClick={() => handleEdit(route)}>Sửa</button>
                <button onClick={() => handleDelete(route.from, route.to, route.type)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLiLichTrinh;
