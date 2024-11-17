import React, { useState, useEffect } from 'react';
import './lichtrinh.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExchangeAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { database } from '../../API/firebaseconfig';
import { ref, onValue } from "firebase/database"; // Sử dụng onValue để lắng nghe sự thay đổi dữ liệu

function LichTrinh() {
  const [routes, setRoutes] = useState([]); // Khởi tạo state để lưu trữ dữ liệu routes

  useEffect(() => {
    const routesRef = ref(database, 'routes/'); // Tham chiếu tới 'routes' trên Firebase
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      const routesArray = [];

      if (data) {
        Object.keys(data).forEach(from => {
          Object.keys(data[from]).forEach(to => {
            if (data[from][to]) {
              Object.keys(data[from][to]).forEach(type => {
                routesArray.push({
                  from,
                  to,
                  type,
                  ...data[from][to][type]
                });
              });
            }
          });
        });
      }
      
      setRoutes(routesArray); 
    });
  }, []); 

  return (
    <div className="lichtrinh">
      <div className="search-container">
        <div className="search-box">
          <input type="text" className="input-field" placeholder="Nhập điểm đi" />
          <button className="switch-button">
            <FontAwesomeIcon icon={faExchangeAlt} />
          </button>
          <input type="text" className="input-field" placeholder="Nhập điểm đến" />
        </div>

        <div className="table-header">
          <span className="header-item">Tuyến xe</span>
          <span className="header-item">Loại xe</span>
          <span className="header-item">Quãng đường</span>
          <span className="header-item">Thời gian hành trình</span>
          <span className="header-item">Giá vé</span>
          <span className="header-item"></span> 
        </div>
      </div>

      <div className="scroll-container">
        <table className="route-table">
          <tbody>
            {routes.map((route, index) => (
              <tr className="route-row" key={index}>
                <td className="route-details">
                  <span className="from-location">{route.from}</span>
                  <FontAwesomeIcon icon={faExchangeAlt} className="exchange-icon" />
                  <span className="to-location">{route.to}</span>
                </td>
                <td>{route.type}</td>
                <td>{route.distance}</td>
                <td>{route.duration}</td>
                <td>{route.price}</td>
                <td><button className="find-route-btn">Tìm tuyến xe</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LichTrinh;
