const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'futabus.noreply@gmail.com', // Thay bằng email của bạn
    pass: 'wrob izho ftie scvo',  // Mật khẩu ứng dụng hoặc mật khẩu email
  },
});

app.post('/send-ticket', async (req, res) => {
  const { email, bookingInfo } = req.body;

  const {
    bookingCode,
    name,
    phone,
    date,
    hour, 
    from,
    to,
    ghe,
    idxe,
    price,
    type
  } = bookingInfo;

  const mailOptions = {
    from: 'futabus.noreply@gmail.com',
    to: email,
    subject: 'Thông tin vé xe của bạn',
    html: `
      <h3>Thông tin vé xe</h3>
      <p><strong>Mã đặt vé:</strong> ${bookingCode}</p>
      <p><strong>Tên khách hàng:</strong> ${name}</p>
      <p><strong>Số điện thoại:</strong> ${phone}</p>
      <p><strong>Ngày đi:</strong> ${date}</p>
      <p><strong>Thời gian:</strong> ${hour}</p>
      <p><strong>Điểm đi:</strong> ${from}</p>
      <p><strong>Điểm đến:</strong> ${to}</p>
      <p><strong>Loại xe:</strong> ${type}</p>
      <p><strong>Số ghế:</strong> ${ghe}</p>
      <p><strong>Biển số xe:</strong> ${idxe}</p>
      <p><strong>Tổng giá vé:</strong> ${price}.000đ</p>
      <p><strong>Quý khách vui vòng có mặt trước 15 phút tại bến xe đi</strong></p>
      <br>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Vé đã được gửi qua email!' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    res.status(500).send({ message: 'Lỗi khi gửi email.' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`API Email Service đang chạy trên cổng ${PORT}`);
});
