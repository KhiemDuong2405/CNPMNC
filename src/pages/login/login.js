import React, { useState, useEffect } from 'react';
import { auth, firebase } from '../../firebase';
import { useNavigate } from 'react-router-dom'; 
import Spinner from '../../spinner/spinner';

import './login.css';
import leftImage from '../../assets/images/left-section-image.png';
import ketnoi1 from '../../assets/images/ketnoi1.png';
import ketnoi2 from '../../assets/images/ketnoi2.png';
import ketnoi3 from '../../assets/images/ketnoi3.png';
import ketnoi4 from '../../assets/images/ketnoi4.png';


function Login() {
  const navigate = useNavigate(); 
  const [isOtpStep, setIsOtpStep] = useState(false); 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [otp, setOtp] = useState(new Array(6).fill('')); 
  const [error, setError] = useState(''); 
  const [verificationId, setVerificationId] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  if (loading) {
    return <Spinner/>; 
  }

  function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'normal',
        callback: (response) => {
          console.log("reCAPTCHA verified successfully!");
          sendOtp(); 
        },
        'expired-callback': () => {
          setIsOtpStep(false); 
          setError("reCAPTCHA đã hết hạn. Vui lòng thử lại.");
        }
      });
      window.recaptchaVerifier.render().catch((error) => console.error("Lỗi reCAPTCHA:", error));
    }
  }

  const sendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await auth.signInWithPhoneNumber(`+84${phoneNumber}`, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setIsOtpStep(true);
      console.log("OTP sent successfully"); 
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      setError("Không thể gửi OTP. Vui lòng thử lại.");
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (phoneNumber.length != 10) {
      setError("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }
    setupRecaptcha();
    window.recaptchaVerifier.render(); 
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) {
      setError("Vui lòng nhập đầy đủ mã OTP.");
      return;
    }

    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp.join(''));
      await auth.signInWithCredential(credential);

      if (phoneNumber === '0123456789') {
        navigate('/quanlilichtrinh');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Xác thực OTP thất bại:", error);
      setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="body-container">
        <div className="left-section">
          <img src={leftImage} alt="Phương Trang" className="full-left-image" />
        </div>

        <div className="right-section">
          {!isOtpStep ? (
            <div className="login-box">
              <h3>Đăng nhập tài khoản</h3>
              <form onSubmit={handlePhoneSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-phone"
                  />
                </div>
                <div id="recaptcha-container"></div> 
                <button type="submit" className="login-button">Tiếp tục</button>
              </form>
              {error && <p className="error-message">{error}</p>}
            </div>
          ) : (
            <div className="otp-box">
              <h3>Nhập mã xác thực</h3>
              <div className="otp-inputs">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    className="otp-input"
                  />
                ))}
              </div>
              {error && <p className="error-message">{error}</p>}
              <button onClick={handleOtpSubmit} className="otp-submit-button">Xác nhận</button>
            </div>
          )}
        </div>
      </div>

      {/* Phần kết nối FUTA Group */}
      <div className="futa-group-section">
        <h2>KẾT NỐI FUTA GROUP</h2>
        <p>Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng...</p>
        <div className="services">
          <div className="service-item"><img src={ketnoi1} alt="Xe Hợp Đồng" /></div>
          <div className="service-item"><img src={ketnoi2} alt="Mua vé Phương Trang" /></div>
          <div className="service-item"><img src={ketnoi3} alt="Giao Hàng" /></div>
          <div className="service-item"><img src={ketnoi4} alt="Xe Buýt" /></div>
        </div>
      </div>
    </>
  );
}

export default Login;