import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '../../API/firebaseconfig';

import './quanlydoanhthu.css';

function QuanLiDoanhThu() {
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("daily"); // "daily" hoặc "monthly"

  // Fetch daily revenue based on the selected date
  const fetchDailyRevenue = () => {
    setLoading(true);
    const db = getDatabase();
    const revenueRef = ref(db, `revenue/daily/${date}`);
    onValue(
        revenueRef,
        (snapshot) => {
          setLoading(false);
          const data = snapshot.val();
          if (data) {
            setDailyRevenue(Object.values(data));
          } else {
            setDailyRevenue([]);
          }
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
    );
  };

  // Fetch monthly revenue based on the selected month
  const fetchMonthlyRevenue = () => {
    setLoading(true);
    const db = getDatabase();
    const revenueRef = ref(db, `revenue/monthly/${month}`);
    onValue(
        revenueRef,
        (snapshot) => {
          setLoading(false);
          const data = snapshot.val();
          if (data) {
            setMonthlyRevenue(Object.values(data));
          } else {
            setMonthlyRevenue([]);
          }
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
    );
  };

  useEffect(() => {
    if (date) fetchDailyRevenue();
  }, [date]);

  useEffect(() => {
    if (month) fetchMonthlyRevenue();
  }, [month]);

  return (
      <div className="revenue-management">
        <h2>Quản Lý Doanh Thu</h2>

        <div className="filter-options">
          <div>
            <label htmlFor="date">Ngày:</label>
            <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button
                onClick={() => {
                  setActiveSection("daily");
                  fetchDailyRevenue();
                }}
            >
              Xem Doanh Thu Theo Ngày
            </button>
          </div>

          <div>
            <label htmlFor="month">Tháng:</label>
            <input
                type="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
            />
            <button
                onClick={() => {
                  setActiveSection("monthly");
                  fetchMonthlyRevenue();
                }}
            >
              Xem Doanh Thu Theo Tháng
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{`Error: ${error.message}`}</p>}

        {/* Daily Revenue Section */}
        {activeSection === "daily" && (
            <div className="daily-revenue">
              <h3>Doanh Thu Theo Ngày</h3>
              <table>
                <thead>
                <tr>
                  <th>Tuyến</th>
                  <th>Mã xe</th>
                  <th>Loại</th>
                  <th>Số ghế</th>
                  <th>Giường</th>
                  <th>Limousine</th>
                  <th>Tổng tiền</th>
                </tr>
                </thead>
                <tbody>
                {dailyRevenue.length ? (
                    dailyRevenue.map((record, index) => (
                        <tr key={index}>
                          <td>{record.route}</td>
                          <td>{record.carId}</td>
                          <td>{record.type}</td>
                          <td>{record.seatCount} ghế</td>
                          <td>{record.bedCount} giường</td>
                          <td>{record.limoCount} limousine</td>
                          <td>{record.totalAmount} VND</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="7">Không có dữ liệu</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}

        {/* Monthly Revenue Section */}
        {activeSection === "monthly" && (
            <div className="monthly-revenue">
              <h3>Doanh Thu Theo Tháng</h3>
              <table>
                <thead>
                <tr>
                  <th>Ngày/tháng/năm</th>
                  <th>Số ghế - Tổng tiền</th>
                  <th>Giường - Tổng tiền</th>
                  <th>Limousine - Tổng tiền</th>
                </tr>
                </thead>
                <tbody>
                {monthlyRevenue.length ? (
                    monthlyRevenue.map((record, index) => (
                        <tr key={index}>
                          <td>{record.date}</td>
                          <td>{record.seatCount} ghế - {record.seatTotal} VND</td>
                          <td>{record.bedCount} giường - {record.bedTotal} VND</td>
                          <td>{record.limoCount} limousine - {record.limoTotal} VND</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="4">Không có dữ liệu</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}

export default QuanLiDoanhThu;
