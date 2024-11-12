import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '../../API/firebaseconfig';

import './quanlydoanhthu.css';

function QuanLiDoanhThu() {
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [dailyBookings, setDailyBookings] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("daily");

    // Fetch daily bookings based on the selected date
    const fetchDailyBookings = () => {
        setLoading(true);
        const db = getDatabase();
        const bookingsRef = ref(db, `bookings`);
        onValue(
            bookingsRef,
            (snapshot) => {
                setLoading(false);
                const data = snapshot.val();
                if (data) {
                    // Filter bookings for the selected date
                    const dailyData = Object.values(data).flatMap(userBookings =>
                        Object.values(userBookings).filter(record => record.date === date)
                    );
                    setDailyBookings(dailyData);
                } else {
                    setDailyBookings([]);
                }
            },
            (error) => {
                setLoading(false);
                setError(error);
            }
        );
    };

    // Fetch monthly summary based on the selected month
    const fetchMonthlySummary = () => {
        setLoading(true);
        const db = getDatabase();
        const bookingsRef = ref(db, `bookings`);
        onValue(
            bookingsRef,
            (snapshot) => {
                setLoading(false);
                const data = snapshot.val();
                if (data) {
                    const monthlyData = Object.values(data).flatMap(userBookings =>
                        Object.values(userBookings).filter(record => record.date.startsWith(month))
                    );

                    // Group bookings by date and calculate totals for each day
                    const dailyTotals = monthlyData.reduce((acc, record) => {
                        const date = record.date;
                        if (!acc[date]) {
                            acc[date] = { seatCount: 0, seatTotal: 0, bedCount: 0, bedTotal: 0, limoCount: 0, limoTotal: 0 };
                        }
                        const price = (record.price || 0) * 1000;
                        if (record.type === "Ghế") {
                            acc[date].seatCount += 1;
                            acc[date].seatTotal += price;
                        } else if (record.type === "Giường") {
                            acc[date].bedCount += 1;
                            acc[date].bedTotal += price;
                        } else if (record.type === "Limousine") {
                            acc[date].limoCount += 1;
                            acc[date].limoTotal += price;
                        }
                        return acc;
                    }, {});

                    // Convert the daily totals object to an array for easier mapping in JSX
                    setMonthlySummary(Object.entries(dailyTotals).map(([date, totals]) => ({
                        date,
                        ...totals
                    })));
                } else {
                    setMonthlySummary([]);
                }
            },
            (error) => {
                setLoading(false);
                setError(error);
            }
        );
    };

    useEffect(() => {
        if (date) fetchDailyBookings();
    }, [date]);

    useEffect(() => {
        if (month) fetchMonthlySummary();
    }, [month]);

    // Helper function to format prices
    const formatPrice = (price) => price.toLocaleString("vi-VN") + " VND";

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
                            fetchDailyBookings();
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
                            fetchMonthlySummary();
                        }}
                    >
                        Xem Doanh Thu Theo Tháng
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{`Error: ${error.message}`}</p>}

            {/* Daily Bookings Section */}
            {activeSection === "daily" && (
                <div className="daily-revenue">
                    <h3>Doanh Thu Theo Ngày</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Từ</th>
                            <th>Đến</th>
                            <th>Giờ</th>
                            <th>Mã xe</th>
                            <th>Loại</th>
                            <th>Số ghế</th>
                            <th>Tổng tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dailyBookings.length ? (
                            dailyBookings.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.date}</td>
                                    <td>{record.from}</td>
                                    <td>{record.to}</td>
                                    <td>{record.hour}</td>
                                    <td>{record.idxe}</td>
                                    <td>{record.type}</td>
                                    <td>{record.ghe}</td>
                                    <td>{formatPrice(record.price * 1000)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Không có dữ liệu</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Monthly Summary Section */}
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
                        {monthlySummary.length ? (
                            monthlySummary.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.date}</td>
                                    <td>{record.seatCount} ghế - {formatPrice(record.seatTotal)}</td>
                                    <td>{record.bedCount} giường - {formatPrice(record.bedTotal)}</td>
                                    <td>{record.limoCount} limousine - {formatPrice(record.limoTotal)}</td>
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
