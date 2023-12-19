import style from "../../pages/Customer/Customer.module.scss";
import { Fragment, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clsx from "clsx";
import axios from "axios";
import jsQR, { QRCodeReader } from 'jsqr';
import QRCode from "qrcode.react";

function CustomerQR() {
  const [orderIdCode, setOrderIdCode] = useState("");
  const [result, setResult] = useState('');
  
  const handleImageLoad = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height);

          if (code) {
            console.log(code.data);
            setResult(code.data);
          } else {
            console.log("Không tìm thấy mã QR.");
            setResult('Không tìm thấy mã QR.');
          }
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setOrderIdCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu ở đây, ví dụ: gửi dữ liệu đến server
    //console.log("User entered:",  orderIdCode);
    fetchOrderData();
  };

  const fetchOrderData = async () => {
    try {
      await axios
        .get("http://localhost:8080/transTeller/getOrderById", {
          params: {
            order_id: orderIdCode,
          },
        })
        .then((response) => {
          if (response.data.message === "Successful") {
            console.log(response.data.orderObject);
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  // QR Code

  return (
    <Fragment>
      <Header showNavBar={false} />
      <div className={style.container}>
        <label htmlFor={style.orderIdCode}>Enter your order code:</label>
        <input
          className={clsx(style.orderIdCode)}
          type="text"
          name="orderIdCode"
          onChange={handleInputChange}
        />

        <input type="file" accept="image/*" onChange={handleImageLoad} />

        <button className={style.orderCodeBtn} onClick={handleSubmit}>
          Search your order information
        </button>

        {/* QR Code Scanner */}
        
      </div>
      <Footer />
    </Fragment>
  );
}

export default CustomerQR;
