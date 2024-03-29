import clsx from "clsx";
import React from "react";
import style from "./CreateOrder.module.scss";
import { Fragment, useState, useContext, useEffect } from "react";
import axios from "axios";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { LoginContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

function CreateOrderPage() {
  const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Cuộn lên đầu trang khi chuyển đến một trang mới
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
    // Check user có phải là nhân viên điểm giao dịch hay không
    let cnt = 0;
    useEffect(() => {
        if((!storedIsLogin 
            || nowTime - storedOutTime > 3600000 
            || storedUserInfo.uRole != "3") // Sau do chuyen thanh 3
            && cnt === 0
            ) {
            cnt ++;
            alert("You have to login with Transaction Teller account before access this page!");
            navigate("/login");
            localStorage.setItem('isLogin', JSON.stringify(false));
            localStorage.setItem('userInfo', JSON.stringify({
                uId : "",
                uName : "",
                uPhone : "",
                uPassword : "",
                uRole: "",
                uUnit: ""
            }));
        }
    }, [1])

  // Giá, địa chỉ chọn mốc, bỏ ngày gửi
  // 

  // Chưa có đoạn dẫn đến page này nên chưa có userInfo
  // Chỉ cần thay userInfo.uUnit vào unit handlePath
  const { userInfo } = useContext(LoginContext);

  //Xử lý số điện thoại
  const [isCustomerPhone, setIsCustomerPhone] = useState(true);
  const [isWeight, setIsWeight] = useState(true);

  let phoneInCustomer = document.querySelector("." + style.customer_phone);

  // Check lỗi customer phone
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

  // Check lỗi weight 
  function handleWeightBlur() {
    if (!isNaN(parseFloat(inputs.weight)) && isFinite(inputs.weight)) {
      setIsWeight(true);
    }
    else {
      setIsWeight(false);
    }
  }

  const [isReceiverPhone, setIsReceiverPhone] = useState(true);

  let phoneInReceiver = document.querySelector("." + style.receiver_phone);

  // Check lỗi receiver phone
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

  // Xử lý đường đi kho hàng
  useEffect(() => {
    const handlePath = async (e) => {
      try {
        await axios.get("http://localhost:8080/transTeller/getPathStart", {params : {
          unit : storedUserInfo.uUnit,
        }})
        .then((response) => {
          paths.transaction_start = response.data.transactionStart;
          paths.gathering_start = response.data.gatherStart;
          paths.gather_id_start = response.data.gatherIdStart;
        }).catch((error) => {
          console.log(error);
        });
  
      } catch (err) {
        console.log(err.respone.data);
      }
    };
    handlePath();
  }, []);

  // Xử lý địa chỉ

  const [gathers, setGather] = useState([]);
  const [selectedGather, setSelectedGather] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');

  // Lấy thông tin tất cả điểm tập kết
  useEffect(() => {
    const fetchGatherData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/transTeller/showAllGathers');
        setGather(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchGatherData();
  }, []);


  // Lấy thông tin tất cả điểm giao dịch thuộc điểm tập kết
  useEffect(() => {
    const fetchTransactionData = async () => {
      //console.log(selectedGather);
      try {
        if (selectedGather && selectedGather !== '') {
          await axios.get('http://localhost:8080/transTeller/showAllTransactionsByGather', {params: {
            gather_id: selectedGather,
          }})
            .then(response => {
              //console.log(response.data);
              const sortedProvinces = response.data.sort((a, b) => a.trans_name.localeCompare(b.trans_name));
              setProvinces(sortedProvinces);
            })
            .catch(error => {
              console.error('Error fetching provinces:', error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactionData();
  }, [selectedGather]);

  const handleGatherChange = (e) => {
    setSelectedGather(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };
  
  // Lưu thông tin order
  const [inputs, setInputs] = useState({
    create_unit: storedUserInfo.uUnit,
    customer_name: "",
    customer_phone: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    date: "",
    weight: "",
    description: "",
    price: '',
  });

  // Xử lý về giá
  const [finalPrice, setFinalPrice] = useState(0);
  useEffect(() => {
    const checkGatherPath = () => {
      const selectedGatherSplit = selectedGather.substring(1,selectedGather.length);
      const pathStartSplit = paths.gather_id_start.substring(1,paths.gather_id_start.length);
      // console.log(parseInt(selectedGatherSplit));
      // console.log(parseInt(pathStartSplit));
      // console.log(Math.abs(parseInt(selectedGatherSplit) - parseInt(pathStartSplit)));
      setFinalPrice(30000 + inputs.weight * 2000 + Math.abs(parseInt(selectedGatherSplit) - parseInt(pathStartSplit)) * 10000);
    };
    checkGatherPath();
  }, [selectedGather, inputs.weight]);

  // Lưu trạng thái đường đi
  const [paths, setPaths] = useState({
    transaction_start: "",
    gathering_start: "",
    gathering_end: "",
    transaction_end: "",
    gather_id_start: "",
  });

  // Lưu giá trị nhập vào
  const handleChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  // Xử lý lỗi trước khi tạo order
  function handleErrorBeforeSubmit() {
    handleCustomerPhoneBlur();
    handleReceiverPhoneBlur();
    handleWeightBlur();

    if(inputs.customer_name === '' || inputs.description === '' 
    || inputs.receiver_name === '' || selectedProvince === '' || inputs.receiver_address === "") {
      alert("Please fill all fields");
    } else if (isCustomerPhone && isReceiverPhone && inputs.customer_phone !== "" && isWeight
    && inputs.receiver_phone !== "" && inputs.receiver_address !== "") {
      inputs.date = new Date().toString();
      inputs.receiver_address += "#" + selectedProvince;
      inputs.price = finalPrice;
      handleSubmit();
    }
  }

  // Tạo order
  const handleSubmit = async (e) => {
    //await handlePath();
    // console.log(paths);
    console.log(inputs);
    try {
      if(storedUserInfo.uUnit === selectedProvince) {
        await axios.post("http://localhost:8080/transTeller/createOrderStep6", inputs)
        .then((response) => {
          alert(response.data.returnMessage);
          if(response.data.returnMessage === "Tạo thành công 1 đơn hàng") {
            navigate('/deliveryReceipt', {state: { 
              customerName: inputs.customer_name, 
              customerPhone: inputs.customer_phone,
              customerAddress: paths.transaction_start + ', ' +  paths.gathering_start,
              weight: inputs.weight,
              price: inputs.price,
              receiverName: inputs.receiver_name,
              receiverAddress: inputs.receiver_address,
              receiverPhone: inputs.receiver_phone,
              date: inputs.date,
              adminName: storedUserInfo.uName,
              orderId: response.data.orderId,
            }});
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else {
        await axios.post("http://localhost:8080/transTeller/createOrder", inputs)
      .then((response) => {
        alert(response.data.returnMessage);
        if(response.data.returnMessage === "Tạo thành công 1 đơn hàng") {
          navigate('/deliveryReceipt', {state: { 
            customerName: inputs.customer_name, 
            customerPhone: inputs.customer_phone,
            customerAddress: paths.transaction_start + ', ' +  paths.gathering_start,
            weight: inputs.weight,
            price: inputs.price,
            receiverName: inputs.receiver_name,
            receiverAddress: inputs.receiver_address,
            receiverPhone: inputs.receiver_phone,
            date: inputs.date,
            adminName: storedUserInfo.uName,
            orderId: response.data.orderId,
          }});
        }
      })

      .catch((error) => {
        console.log(error);
      });
      }
      
    } catch (err) {
      console.log(err.respone.data);
    }
  }

  return (
    <Fragment>
      <Header showSlider={false} />
      <div className={style.container}>
        <header className={style.header}>
          <h1>Create new order</h1>
        </header>
        <div className={style.content}>
          <div>
            <label htmlFor={style.customer_name}>Customer name:</label>
            <input
              className={clsx(style.customer_name)}
              type="text"
              name="customer_name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={style.customer_phone}>
              Customer phone:
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
            {/*<i className= {clsx({[style.errMessage] : isCustomerPhone}, style.message)}>  Invalid phone number</i>*/}
          </div>

          <div>
            <label htmlFor={style.receiver_name}>Receiver name:</label>
            <input
              className={style.receiver_name}
              type="text"
              name="receiver_name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={style.receiver_phone}>
              Receiver phone:
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
            {/*<i className= {clsx({[style.errMessage] : isReceiverPhone}, style.message)}>  Invalid phone number</i>*/}
          </div>

          <div>
            <label htmlFor={style.receiver_city}>Select City:</label>
            <select className={style.selectedGatherName} id="gather" value={selectedGather} onChange={handleGatherChange}>
            {gathers.length === 0 && (
              <option value="" disabled>-- Loading Regions --</option>
            )}
            {gathers.length > 0 && (
              <>
                <option value="">-- Select Region --</option>
                {gathers.map((gather) => (
                  <option key={gather.gather_id} value={gather.gather_id}>
                    {gather.gather_name}
                  </option>
                ))}
              </>
            )}
            </select>
            <select className={style.selectedProvinceName} id="province" value={selectedProvince} onChange={handleProvinceChange}>
            {selectedGather && provinces.length > 0 && (
              <>
                <option value="">-- Select City --</option>
                {provinces.map((province) => (
                  <option key={province.trans_id} value={province.trans_id}>
                    {province.trans_name}
                  </option>
                ))}
              </>
            )}  
            </select>
          </div>

          <div>
            <label htmlFor={style.receiver_address}>Receiver address:</label>
            <input
              className={clsx(style.receiver_address)}
              type="text"
              name="receiver_address"
              placeholder="VD: 18 Xuân Thủy, Cầu Giấy"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={style.weight}>Weight:</label>
            <input className={clsx(style.weight, {[style.invalidBorder]: !isWeight,})} type="text" name="weight" 
              onChange={handleChange}
              onBlur={handleWeightBlur}
              onFocus={() => {
                setIsWeight(true);
              }}
            />
          </div>

          <div>
            <label htmlFor={style.description}>Description:</label>
            <input className={style.description} type="text" name="description" onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor={style.price}>Price:</label>
            <strong id={clsx(style.finalPrice)}>{finalPrice} VND</strong>
          </div>

        </div>

        <button className={style.createOrderBtn} onClick={handleErrorBeforeSubmit}>Create Order</button>
      </div>
      <Footer />
    </Fragment>
  );
}

export default CreateOrderPage;
