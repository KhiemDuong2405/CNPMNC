import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderAdmin from './components_admin/header/Header_admin';
import Footer from './components/footer/Footer';

function AdminLayout() {
  return (
    <>
      <HeaderAdmin />
      <Outlet /> 
      <Footer />
    </>
  );
}

export default AdminLayout;
