import clsx from "clsx";
import React from "react";
import style from "./CreateOrder.module.scss";
import { Fragment, useState, useContext } from "react";
import axios from "axios";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { LoginContext } from "../../../../App";

function CreateOrderPage() {

  // Chưa có đoạn dẫn đến page này nên chưa có userInfo
  // Chỉ cần thay userInfo.uUnit vào unit handlePath
  const { userInfo } = useContext(LoginContext);

  //Xử lý số điện thoại
  const [isCustomerPhone, setIsCustomerPhone] = useState(true);

  let phoneInCustomer = document.querySelector("." + style.customer_phone);

  function handleCustomerPhoneBlur() {
    if (phoneInCustomer) {
      var phoneno = /^\d{10}$/;
      if (phoneInCustomer.value.match(phoneno)) {
        setIsCustomerPhone(true);
      } else {
        setIsCustomerPhone(false);
      }
    } else {
      phoneInCustomer = document.querySelector("." + style.customer_phone);
      handleCustomerPhoneBlur();
    }
  }

  const [isReceiverPhone, setIsReceiverPhone] = useState(true);

  let phoneInReceiver = document.querySelector("." + style.receiver_phone);

  function handleReceiverPhoneBlur() {
    if (phoneInReceiver) {
      var phoneno = /^\d{10}$/;
      if (phoneInReceiver.value.match(phoneno)) {
        setIsReceiverPhone(true);
      } else {
        setIsReceiverPhone(false);
      }
    } else {
      phoneInReceiver = document.querySelector("." + style.receiver_phone);
      handleReceiverPhoneBlur();
    }
  }

  // Xử lý địa chỉ
  const[isReceiverAddress, setIsReceiverAddress] = useState(true);
  
  let checkAddress;

  function handleReceiverAddress() {
    checkAddress = inputs.receiver_address.split(', ').pop();
    //console.log(checkAddress);
    if(!checkAddress || !inputs.receiver_address.includes(', ')) {
      setIsReceiverAddress(false);
    } else {
      setIsReceiverAddress(true);
      //inputs.receiver_address = checkAddress;
    }
  }
  
  // Lưu thông tin order
  const [inputs, setInputs] = useState({
    customer_name: "",
    customer_phone: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    date: "",
    weight: "",
    description: "",
    price: "",
  });

  // Lưu trạng thái đường đi
  const [paths, setPaths] = useState({
    transaction_start: "",
    gathering_start: "",
    gathering_end: "",
    transaction_end: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };


  function handleErrorBeforeSubmit() {
    handleCustomerPhoneBlur();
    handleReceiverPhoneBlur();
    handleReceiverAddress();
    if(isCustomerPhone && isReceiverPhone && isReceiverAddress 
      && inputs.customer_phone !== "" && inputs.receiver_phone !== "" && inputs.receiver_address !== "") {
      handleSubmit();
    }
  }

  // Xử lý đường đi kho hàng
  const handlePath = async (e) => {
    try {
      await axios.get("http://localhost:8080/transTeller/getPathStart", {params : {
        unit : "t01",
      }})
      .then((response) => {
        paths.transaction_start = response.data.transactionStart;
        paths.gathering_start = response.data.gatherStart;
      }).catch((error) => {
        console.log(error);
      });

      await axios.get("http://localhost:8080/transTeller/getPathEnd", {params : {
        address: checkAddress,
      }}).then((response) => {
        if(response.data.message === "Hợp lệ"){
          paths.transaction_end = checkAddress;
          paths.gathering_end = response.data.gatherEnd;
        } else {
          alert(response.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    } catch (err) {
      console.log(err.respone.data);
    }
  };

  const handleSubmit = async (e) => {
    await handlePath();
    console.log(paths);
    console.log(inputs);
    try {
      await axios.post("http://localhost:8080/transTeller/createOrder", inputs)
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (err) {
      console.log(err.respone.data);
    }
  }

  return (
    <Fragment>
      <Header showNavBar={false} />
      <div className={style.container}>
        <header className={style.header}>
          <h1>Tạo đơn hàng chuyển phát</h1>
        </header>
        <div className={style.content}>
          <div>
            <label htmlFor={style.customer_name}>Tên Người Gửi:</label>
            <input
              className={clsx(style.customer_name)}
              type="text"
              name="customer_name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={style.customer_phone}>
              Số điện thoại người gửi:
            </label>
            <input
              className={clsx(style.customer_phone, {[style.invalidBorder]: !isCustomerPhone,})}
              type="text"
              name="customer_phone"
              onBlur={handleCustomerPhoneBlur}
              onFocus={() => {
                setIsCustomerPhone(true);
              }}
              onChange={handleChange}
            />
            <i className= {clsx({[style.errMessage] : isCustomerPhone}, style.message)}>  Invalid phone number</i>
          </div>

          <div>
            <label htmlFor={style.receiver_name}>Tên Người Nhận:</label>
            <input
              className={style.receiver_name}
              type="text"
              name="receiver_name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={style.receiver_phone}>
              Số điện thoại người nhận:
            </label>
            <input
              className={clsx(style.receiver_phone, {[style.invalidBorder]: !isReceiverPhone,})}
              type="text"
              name="receiver_phone"
              onBlur={handleReceiverPhoneBlur}
              onFocus={() => {
                setIsReceiverPhone(true);
              }}
              onChange={handleChange}
            />
            <i className= {clsx({[style.errMessage] : isReceiverPhone}, style.message)}>  Invalid phone number</i>
          </div>

          <div>
            <label htmlFor={style.receiver_address}>Địa Chỉ Người Nhận:</label>
            <input
              className={clsx(style.receiver_address, {[style.invalidBorder]: !isReceiverAddress})}
              type="text"
              name="receiver_address"
              placeholder="VD: 18 Xuân Thủy, Cầu Giấy, Hà Nội (Bắt buộc có tỉnh thành)"
              onBlur={handleReceiverAddress}
              onFocus={() => {
                setIsReceiverAddress(true);
              }}
              onChange={handleChange}
            />
            <i className= {clsx({[style.errMessage] : isReceiverAddress}, style.message)}>  Invalid address</i>
          </div>
  
          <div>
            <label htmlFor={style.date}>Ngày gửi:</label>
            <input className={style.date} type="date" name="date" onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor={style.weight}>Cân nặng:</label>
            <input className={style.weight} type="text" name="weight" onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor={style.description}>Mô tả:</label>
            <input className={style.description} type="text" name="description" onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor={style.price}>Giá:</label>
            <input className={style.price} type="text" name="price" onChange={handleChange}/>
          </div>

        </div>
        <button className={style.createOrderBtn} onClick={handleErrorBeforeSubmit}>Create Order</button>
      </div>
      <Footer />
    </Fragment>
  );
}

export default CreateOrderPage;
