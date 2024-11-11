import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import Body from './pages/trangchu/Body';
import LienHe from './pages/lienhe/lienhe';
import VeChungToi from './pages/vechungtoi/vechungtoi';
import LichTrinh from './pages/lichtrinh/lichtrinh';
import TraCuuVe from './pages/tracuu/tracuuve';
import TinTuc from './pages/tintuc/tintuc';
import Login from './pages/login/login';
import DatVe from './pages/datve/datve';
import ThanhToan from './pages/thanhtoan/thanhtoan';
import LichTrinhAdmin from './admin/LichTrinh/QuanLiLichTrinh';
import ChuyenXeAdmin from './admin/ChuyenXe/QuanLiChuyenDi';
import QuanLiXe from './admin/QuanLiXe/QuanLiXe';
import QuanLiDoanhThu from './admin/DoanhThu/QuanLyDoanhThu';
import QuanLiKhachHang from './admin/KhachHang/QuanLiKhachHang';
import Ketquathanhtoan from "./pages/ketquathanhtoan/ketquathanhtoan";

function App() {
  return (
    <Router>
      <Routes>

        {/* User */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Body />} />
          <Route path="/contact" element={<LienHe />} />
          <Route path="/aboutus" element={<VeChungToi />} />
          <Route path="/schedule" element={<LichTrinh />} />
          <Route path="/rescueticket" element={<TraCuuVe />} />
          <Route path="/tintuc" element={<TinTuc />} />
          <Route path="/login" element={<Login />} />
          <Route path="/datve" element={<DatVe />} />
          <Route path="/thanhtoan" element={<ThanhToan/>}/>
          <Route path="/ketquathanhtoan" element={<Ketquathanhtoan />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/quanlilichtrinh" element={<LichTrinhAdmin />} />
          <Route path="/quanlichuyendi" element={<ChuyenXeAdmin />} />
          <Route path="/quanlixe" element={<QuanLiXe />} />
          <Route path="/quanlidoanhthu" element={<QuanLiDoanhThu />} />
          <Route path="/quanlikhachhang" element={<QuanLiKhachHang/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
