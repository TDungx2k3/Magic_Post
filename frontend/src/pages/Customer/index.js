import style from "../../pages/Customer/Customer.module.scss";
import { Fragment, useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clsx from "clsx";
import axios from "axios";
import jsQR, { QRCodeReader } from 'jsqr';
import QRCode from "qrcode.react";

function CustomerQR() {
  const [orderIdCode, setOrderIdCode] = useState("");
  const [result, setResult] = useState('');
  const [delivery, setDelivery] = useState('');
  const inputTextRef = useRef(null);
  const inputQRRef = useRef(null);
  const [receiverAddressFormat, setReceiverAddressFormat] = useState('');
  const [mappedDelivery, setMappedDelivery] = useState([]);

  // Lấy thông tin địa chỉ cụ thể
  useEffect(() => {
    if(result && result.receiver_address !== "") {
      const part = result.receiver_address.split('#');
      const fetchTransData = async () => {
        try {
          await axios.get('http://localhost:8080/transTeller/getTransactionById', {params: {
            transaction_id: part[1],
          }})
          .then((response) => {
            part[1] = response.data.trans_name;
            setReceiverAddressFormat(part[0] + ', ' + part[1]);
          }).catch((error) => {
            console.log(error);
          });
          //console.log(response.data);
        } catch (error) {
          console.error('Error fetching regions:', error);
        }
      };
      

      // Lấy thông tin vận chuyển
      const getDeliveryByOrderId = async () => {
        try {
          await axios.get("http://localhost:8080/transTeller/getDeliveryByOrderId", {
            params: {
              order_id: result.order_id,
            }  
          }).then((response) => {
            setDelivery(response.data);
            console.log(delivery);
          })
          .catch((error) => {
            console.log(error);
          });
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      };

      fetchTransData();
      getDeliveryByOrderId();
    }
  }, [result]);

  // Chuyển đổi thông tin các điểm giao dịch, tập kết
  useEffect(()  => {
    const mapToAddressType = async (toId) => {
      if (toId.startsWith("r")) {
        return result.receiver_address.split('#')[0];
      } else if (toId.startsWith("t")) {
        try {
          let transName;
          await axios.get("http://localhost:8080/transTeller/getTransNameById", {
            params: {
              trans_id: toId,
            }  
          }).then((response) => {
            console.log(response.data.trans_name);
            transName = response.data.trans_name;
          })
          .catch((error) => {
            console.log(error);
          });
          return transName;
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      } else if (toId.startsWith("g")) {
        try {
          let gatherName;
          await axios.get("http://localhost:8080/transTeller/getGatherNameById", {
            params: {
              gather_id: toId,
            }  
          }).then((response) => {
            console.log(response.data);
            gatherName = response.data.gather_name;
          })
          .catch((error) => {
            console.log(error);
          });
          return gatherName;
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      } else {
        // Xử lý trường hợp khác nếu cần
        return "unknown"; 
      }
    };

    // Lưu thông tin tên điểm giao dịch, tập kết
    const fetchAddress = async () => {
      if (Array.isArray(delivery)) {
        const mappedDeliveryData = await Promise.all(
          delivery.map(async (item)  => ({
            ...item,
            address: await mapToAddressType(item.to_id),
          }))
        );
        setMappedDelivery(mappedDeliveryData);
        console.log(mappedDelivery);
      } else {
        console.log("Error: delivery is not an array");
      }
    }

    fetchAddress();
    
  }, [result, delivery]);
  
  
  // Đọc ảnh QR code
  const handleImageLoad = (e) => {
    //setResult('');
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
            //console.log(JSON.parse(code.data));
            setResult(JSON.parse(code.data));
            //console.log(result);
            if(JSON.parse(code.data).customer_name === undefined){
              alert("Mã QR không hợp lệ hoặc không tồn tại đơn hàng.");
            }
            //console.log(JSON.parse(code.data));
          } else {
            alert("Mã QR không hợp lệ.");
          }
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
    clearInputTextField();
  };

  // Xóa text field khi nhập ảnh
  const clearInputTextField = () => {
    if (inputTextRef.current) {
      inputTextRef.current.value = ""; // Set the input value directly to an empty string
    }
  };

  // Xóa ảnh khi nhập text field
  const clearInputQRField = () => {
    if (inputQRRef.current) {
      inputQRRef.current.value = ""; // Set the input value directly to an empty string
    }
  };

  // handle text input
  const handleInputChange = (e) => {
    setOrderIdCode(e.target.value);
  };

  // search text code
  const handleSubmit = (e) => {
    e.preventDefault();
    //setResult('');
    // Xử lý dữ liệu ở đây, ví dụ: gửi dữ liệu đến server
    //console.log("User entered:",  orderIdCode);
    fetchOrderData();
    clearInputQRField();
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
            setResult(response.data.orderObject)
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

  return (
    <Fragment>
      <Header showSlider={false} />
      <div className={style.container}>
        <div className={style.textCode}>
          <label htmlFor={style.orderIdCode}>Enter your order code:</label>
          <input
            className={clsx(style.orderIdCode)}
            ref={inputTextRef}
            type="text"
            name="orderIdCode"
            onChange={handleInputChange}
          />

          <button className={style.orderCodeBtn} onClick={handleSubmit}>
            Search your order information
          </button>
        </div>
        

        {/* QR Code Scanner */}
        <div className={style.qrCode}>
          <label htmlFor={style.qrCode}>Upload your QR image:</label>
          <input ref={inputQRRef} type="file" accept="image/*" onChange={handleImageLoad} />
        </div>
        
        {/* Order Details */}
        <div className={style.orderInfo}>
        {result.order_id !== undefined && (
          <>
            <div>
              <section className={style.orderTextInfo}>
                <h1>Order Information</h1>
                <p className={style.title}>Customer Information</p>
                <p>Customer: {result.customer_name}</p>
                <p>{result.customer_phone}</p>
                <p className={style.title}>Order detail</p>
                <p>Receiver: {result.receiver_name}</p>
                <p>{result.receiver_phone}</p>
                <p>{receiverAddressFormat}</p>
                <p>Order Detail: {result.description}</p>
                <p>Weight: {result.weight}kg</p>
                <p>Price: {result.price} VND</p>
                <p>Date: {result.date}</p>
              </section>
              
              <section className={style.orderDeliveryInfo}>
               <h1>Delivery</h1>
               {mappedDelivery.length > 0 && (
                <>
                  {mappedDelivery.map((item, index) => (
                    <div key={index}>
                      {index === 0 && (
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đã xác nhận tại điểm giao dịch {mappedDelivery[index].address}</p>
                        </>
                      )}

                      {index === mappedDelivery.length - 1 && result.order_status === "lost" && (
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng bị đã bị thất lạc</p>
                        </>
                      )}

                      {index !== 0 && mappedDelivery[index].deliver_status === -1 && result.order_status !== "lost" && (
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng bị từ chối bởi khách hàng</p>
                        </>
                      )}

                      {index !== 0 && index !== mappedDelivery.length - 1 && mappedDelivery[index].deliver_status === 0 && (
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                        </>
                      )}

                      {index !== 0 && index !== mappedDelivery.length - 1 && mappedDelivery[index].deliver_status === 1 && (
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đã đến {mappedDelivery[index].address}</p>
                        </>
                      )}

                      {index !== 0 && index === mappedDelivery.length - 1 && mappedDelivery[index].deliver_status === 0 && result.order_status !== "lost" &&(
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                        </>
                      )}

                      {index !== 0 && index === mappedDelivery.length - 1 && mappedDelivery[index].deliver_status === 1 && result.order_status !== "lost" &&(
                        <>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đang trên đường chuyển đến {mappedDelivery[index].address}</p>
                          <p><i>{mappedDelivery[index].date}</i>Đơn hàng đã đến {mappedDelivery[index].address}</p>
                        </>
                      )}
                    </div>
                  ))}
                </>
               )}
              </section>
            </div>
          </>
        )}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default CustomerQR;
