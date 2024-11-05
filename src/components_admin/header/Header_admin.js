import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { auth } from '../../firebase';  
import './Header.css';
import Spinner from '../../spinner/spinner';
import logo from '../../assets/images/logopt.svg';
import userIcon from '../../assets/images/user.png';
import { onAuthStateChanged } from "firebase/auth";

function Header() {
  const [phoneNumber, setPhoneNumber] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userPhoneNumber = user.phoneNumber;
        if (userPhoneNumber === '+84123456789') {
          const formattedPhoneNumber = userPhoneNumber.replace(/^(\+84)/, '0');
          setPhoneNumber(formattedPhoneNumber);
        } else {
          navigate('/'); 
        }
      } else {
        navigate('/'); 
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, [navigate]);

 
  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      navigate('/'); 
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <Spinner />; 
  }

  return (
    <div className="navbar">
      <div className="navbar-top">
        <div className="navbar-left navbar-left-2">
          <div className="user-info">
              <img src={userIcon} alt="User Icon" className="icon" />
              <span>Chào {phoneNumber} </span>
          </div>
        </div>

        <div className="navbar-center">
          <img src={logo} alt="FUTA Bus Lines Logo" className="logo" />
        </div>

        <div className="navbar-right">
            <div onClick={handleLogout}>Đăng xuất</div>
        </div>
      </div>

      <div className="navbar-menu">
        <ul>
          <li className='menu-admin-link'>
            <NavLink to="/quanlilichtrinh" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Quản lí lịch trình
            </NavLink>
          </li>
          <li className='menu-admin-link'>
            <NavLink to="/quanlichuyendi" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Quản lí chuyến đi
            </NavLink>
          </li>
          <li className='menu-admin-link'>
            <NavLink to="/quanlixe" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Quản lí xe
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
