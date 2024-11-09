import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../API/firebaseconfig';
import './quanlydoanhthu.css';

function QuanLiDoanhThu() {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // New state for total revenue
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleFilterByDate = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn một ngày hợp lệ.");
      return;
    }
    
    const date = new Date(selectedDate);
    if (isNaN(date)) {
      alert("Vui lòng chọn một ngày hợp lệ.");
      return;
    }
    
    const dateString = date.toISOString().split('T')[0];
    const bookingRef = ref(database, `bookings/${dateString}`);
    
    onValue(bookingRef, (snapshot) => {
      let totalRevenueForDate = 0;
      snapshot.forEach((childSnapshot) => {
        totalRevenueForDate += childSnapshot.val().amount;
      });
      setDailyRevenue(totalRevenueForDate);
      updateTotalRevenue(totalRevenueForDate, monthlyRevenue); // Update total revenue
    });
  };

  const handleFilterByMonth = () => {
    if (!selectedMonth) {
      alert("Vui lòng chọn một tháng hợp lệ.");
      return;
    }
    
    const [year, month] = selectedMonth.split('-');
    const bookingRef = ref(database, 'bookings');

    onValue(bookingRef, (snapshot) => {
      let totalRevenueForMonth = 0;
      snapshot.forEach((childSnapshot) => {
        const bookingDate = new Date(childSnapshot.key);
        if (bookingDate.getFullYear() === parseInt(year) && bookingDate.getMonth() === parseInt(month) - 1) {
          totalRevenueForMonth += childSnapshot.val().amount;
        }
      });
      setMonthlyRevenue(totalRevenueForMonth);
      updateTotalRevenue(dailyRevenue, totalRevenueForMonth); // Update total revenue
    });
  };

  const updateTotalRevenue = (daily, monthly) => {
    setTotalRevenue(daily + monthly); // Sum up daily and monthly revenues for total
  };

  return (
    <div className="revenue-management">
      <h2>Quản Lý Doanh Thu</h2>

      <div className="revenue-dashboard">
        <div className="dashboard-item">
          <h3>Doanh Thu Theo Ngày</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button onClick={handleFilterByDate} className="filter-button">Lọc</button>
          <p>{dailyRevenue} VND</p>
        </div>

        <div className="dashboard-item">
          <h3>Doanh Thu Theo Tháng</h3>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-input"
          />
          <button onClick={handleFilterByMonth} className="filter-button">Lọc</button>
          <p>{monthlyRevenue} VND</p>
        </div>

        <div className="dashboard-item">
          <h3>Tổng Doanh Thu</h3>
          <p>{totalRevenue} VND</p> {/* Display total revenue */}
        </div>
      </div>
    </div>
  );
}

export default QuanLiDoanhThu;
