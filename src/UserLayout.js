import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function UserLayout() {
  return (
    <>
      <Header />
      <Outlet /> {/* Outlet sẽ render các tuyến đường con */}
      <Footer />
    </>
  );
}

export default UserLayout;
