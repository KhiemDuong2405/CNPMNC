import React, { useState, useEffect } from 'react';
import { database } from '../../API/firebaseconfig';
import { ref, set, remove, onValue, push } from "firebase/database";
import './quanlikhachhang.css';

function QuanLiKhachHang() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  useEffect(() => {
    const customersRef = ref(database, 'customers/');
    onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      const customersArray = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
      setCustomers(customersArray);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      const customerRef = ref(database, `customers/${editingCustomerId}`);
      await set(customerRef, formData);
      setIsEditing(false);
      setEditingCustomerId(null);
    } else {
      const newCustomerRef = push(ref(database, 'customers'));
      await set(newCustomerRef, formData);
    }

    setFormData({ name: '', email: '', phoneNumber: '' });
  };

  const handleEdit = (customer) => {
    setFormData({ name: customer.name, email: customer.email, phoneNumber: customer.phoneNumber });
    setIsEditing(true);
    setEditingCustomerId(customer.id);
  };

  const handleDelete = async (id) => {
    await remove(ref(database, `customers/${id}`));
  };

  return (
    <div className="quan-li-khach-hang">
      <h2>Quản Lý Khách Hàng</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          placeholder="Tên khách hàng" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="text" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleInputChange} 
          placeholder="Số điện thoại" 
          required 
        />
        
        <button type="submit">
          {isEditing ? "Cập Nhật Khách Hàng" : "Thêm Khách Hàng"}
        </button>
        
        {isEditing && (
          <button 
            type="button" 
            onClick={() => {
              setIsEditing(false);
              setEditingCustomerId(null);
              setFormData({ name: '', email: '', phoneNumber: '' });
            }}>
            Hủy Chỉnh Sửa
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Sửa</button>
                <button onClick={() => handleDelete(customer.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLiKhachHang;
