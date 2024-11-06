import React,{ useEffect } from 'react';
//API TAWKTO
const TawkTo = () => {
  useEffect(() => {
    // Tạo thẻ script và nhúng mã Tawk.to vào trang
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/672b1d024304e3196addc921/1ic06ikft";  // Thay 'your_tawk_id' bằng ID của bạn
    script.async = true;
    document.body.appendChild(script);

    // Clean up khi component bị unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;  // Không cần render gì
};

export default TawkTo;
