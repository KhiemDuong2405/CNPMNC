import React, { useState, useEffect } from 'react';
import './quanlixe.css'; 
import { database } from '../../API/firebaseconfig';
import { ref, set, update, remove, onValue } from "firebase/database";

function QuanLiXe({ onLicensePlatesUpdate }) { 
  const [licensePlates, setLicensePlates] = useState([]);
  const [plateInput, setPlateInput] = useState('');
  const [vehicleType, setVehicleType] = useState('Ghế');
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPlate, setEditPlate] = useState(null);

  useEffect(() => {
    const platesRef = ref(database, 'licensePlates/');
    onValue(platesRef, (snapshot) => {
      const data = snapshot.val();
      const platesArray = [];
      if (data) {
        Object.keys(data).forEach(plate => {
          platesArray.push({
            plate,
            ...data[plate]
          });
        });
      }
      setLicensePlates(platesArray);
      if (onLicensePlatesUpdate) onLicensePlatesUpdate(platesArray); 
    });
  }, []);

  const categorizePlates = (plates) => {
    const categorized = {
      Ghe: [],
      Giuong: [],
      Limousine: []
    };

    plates.forEach(item => {
      if (item.vehicleType === 'Ghế') {
        categorized.Ghe.push(item);
      } else if (item.vehicleType === 'Giường') {
        categorized.Giuong.push(item);
      } else if (item.vehicleType === 'Limousine') {
        categorized.Limousine.push(item);
      }
    });

    return categorized;
  };

  const categorizedPlates = categorizePlates(licensePlates);

  const handleInputChange = (e) => {
    const formattedInput = e.target.value.replace(/\s+/g, '');
    setPlateInput(formattedInput);
    setErrorMessage('');
  };
  

  const handleTypeChange = (e) => {
    setVehicleType(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (plateInput.trim() === '') return;

    const platePattern = /^\d{2}[A-Z]-\d{5}$/;
    if (!platePattern.test(plateInput)) {
      setErrorMessage('Biển số không đúng định dạng');
      return;
    }

    const isDuplicate = licensePlates.some(item => item.plate === plateInput);
    if (isDuplicate && !editMode) {
      setErrorMessage('Biển số đã tồn tại. Vui lòng nhập biển số khác.');
      return;
    }
    
    if (editMode && editPlate) {
      const plateRef = ref(database, `licensePlates/${editPlate}`);

      if (editPlate === plateInput) {
        await update(plateRef, { 
          vehicleType: vehicleType,
          needsMaintenance: false,
          isActive: true 
        });
      } else {
        const newPlateRef = ref(database, `licensePlates/${plateInput}`);
        await set(newPlateRef, { 
          vehicleType: vehicleType,
          needsMaintenance: false,
          isActive: true 
        });
        await remove(plateRef);
      }

      setEditMode(false);
      setEditPlate(null);
    } else {
      const plateRef = ref(database, `licensePlates/${plateInput}`);
      await set(plateRef, { 
        vehicleType: vehicleType,
        needsMaintenance: false,
        isActive: true 
      });
    }

    setPlateInput('');
    setErrorMessage('');
};

  const handleEdit = (plate) => {
    const plateData = licensePlates.find(item => item.plate === plate);
    setPlateInput(plateData.plate);
    setVehicleType(plateData.vehicleType);
    setEditMode(true);
    setEditPlate(plate);
  };

  const toggleMaintenanceStatus = async (plate, needsMaintenance) => {
    await update(ref(database, `licensePlates/${plate}`), { needsMaintenance: !needsMaintenance });
  };

  const toggleActiveStatus = async (plate, isActive) => {
    await update(ref(database, `licensePlates/${plate}`), { isActive: !isActive });
  };

  const handleDelete = async (plate) => {
    await remove(ref(database, `licensePlates/${plate}`));
  };

  const renderTable = (title, plates) => (
    <div key={title}>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th className='bienso'>Biển Số Xe</th>
            <th className='trangthai'>Trạng Thái</th>
            <th className='hoatdong'>Hoạt Động</th>
            <th className='suaxoa'>Chỉnh Sửa / Xóa</th>
          </tr>
        </thead>
        <tbody>
          {plates.map((item) => (
            <tr key={item.plate}>
              <td>{item.plate}</td>
              <td>
                {item.needsMaintenance ? "Đang Bảo Trì" : "Không Bảo Trì"}
                <button
                  className="maintenance-button"
                  onClick={() => toggleMaintenanceStatus(item.plate, item.needsMaintenance)}
                >
                  {item.needsMaintenance ? "Ngừng Bảo Trì" : "Bảo Trì"}
                </button>
              </td>
              <td>
                {item.isActive ? "Đang Hoạt Động" : "Không Hoạt Động"}
                <button
                  className="stop-button"
                  onClick={() => toggleActiveStatus(item.plate, item.isActive)}
                >
                  {item.isActive ? "Ngừng" : "Kích Hoạt"}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(item.plate)} className='btn-ql'>Sửa</button>
                <button onClick={() => handleDelete(item.plate)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const activePlates = licensePlates.filter(item => item.isActive);

  return (
    <div className="quan-li-bien-so">
      <h2>Quản Lý Xe</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={plateInput} 
          onChange={handleInputChange} 
          placeholder="Nhập biển số xe" 
          required 
        />
        <select value={vehicleType} onChange={handleTypeChange} className='loai-xe'>
          <option value="Ghế">Ghế</option>
          <option value="Giường">Giường</option>
          <option value="Limousine">Limousine</option>
        </select>
        <button type="submit">{editMode ? "Lưu" : "Thêm xe"}</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>

      {renderTable("Ghế", categorizedPlates.Ghe)}
      {renderTable("Giường", categorizedPlates.Giuong)}
      {renderTable("Limousine", categorizedPlates.Limousine)}
    </div>
  );
}

export default QuanLiXe;
