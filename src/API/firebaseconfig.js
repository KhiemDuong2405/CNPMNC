// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Thông tin cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB4WpaKFplaUts6qW0C_N-ONd-KpVqy0bw",
    authDomain: "hethonghangxedulich.firebaseapp.com",
    databaseURL: "https://hethonghangxedulich-default-rtdb.firebaseio.com",
    projectId: "hethonghangxedulich",
    storageBucket: "hethonghangxedulich.appspot.com",
    messagingSenderId: "819503679867",
    appId: "1:819503679867:web:72f842f9401702d75ed5de"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

export { database };

