import style from "../DeliveryReceiptPage/DeliveryReceiptPage.module.scss";
import clsx from "clsx";
import dauChuyenPhat from "../../assets/icons/dauChuyenPhat.png";
import { Link, useLocation , useNavigate} from "react-router-dom";
import { animateScroll as scroll } from "react-scroll"
import { format } from 'date-fns';
import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import logo from '../../assets/icons/logo.png'

function DeliveryReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin đơn hàng lúc vừa tạo order
  const {customerName, customerPhone, customerAddress, 
    weight, price, receiverName, receiverAddress, 
    receiverPhone, date, adminName, orderId} = location.state || {};

  let part = receiverAddress.split('#');

  const [receiverAddressFormat, setReceiverAddressFormat] = useState('');
  const[orderObject, setOrderObject] = useState([]);

  // Lấy thông tin địa chỉ cụ thể
  useEffect(() => {
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

    fetchTransData();
  }, [receiverAddress]);


  // Lay doi tuong order
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        await axios.get('http://localhost:8080/transTeller/getOrderById', {params: {
          order_id: orderId,
        }})
        .then((response) => {
          if(response.data.message === 'Successful') {
            setOrderObject(response.data.orderObject);
          } else {
            console.log(response.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Download ảnh mã QR
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Xử lý checkbox
  const [isTaiLieuChecked, setIsTaiLieuChecked] = useState(false);
  const [isHangHoaChecked, setIsHangHoaChecked] = useState(true);

  const handleCheckboxChange = (checkboxType) => {
    if (checkboxType === 'taiLieu') {
      setIsTaiLieuChecked(true);
      setIsHangHoaChecked(false);
    } else if (checkboxType === 'hangHoa') {
      setIsTaiLieuChecked(false);
      setIsHangHoaChecked(true);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Link to ="/" className={clsx(style.logo)}
        onClick={() => {
            navigate("/");
            setTimeout(() => {
                // console.log(2);
                scroll.scrollTo(document.getElementById('top').offsetTop, {
                    spy: true,
                    smooth: true,
                    duration: 500,
                });
            }, 10);
            const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log(storedIsLogin);
            console.log(storedUserInfo);
        }}
        >
            <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }}/>
        </Link>
        <p className={style.orderID}>Số phiếu: {orderId}</p>
        {orderObject && <QRCode id="qrcode-canvas" className={style.qrCode} onClick={handleDownloadQRCode} value={JSON.stringify(orderObject)} />}
      </div>
      <div className={style.body}>
        <div className={style.content1}>
          <i>1. Họ tên địa chỉ người gửi:</i>
          <br />
          {customerName} <br /> {customerAddress}
          <br />
          <br />
          <br />
          Điện Thoại: {customerPhone}
          <div className={style.maNguoiGui}>
            <p>Mã Khách Hàng: 10179</p>
            <p>Mã Bưu Chính: 10179</p>
          </div>
        </div>

        <div className={style.content2}>
          <i>2. Họ tên địa chỉ người nhận:</i>
          <br />
          {receiverName} <br /> {receiverAddressFormat}
          <br />
          <br />
          <br />
          Mã ĐH: {orderId}
          <div className={style.maNguoiNhan}>
            <p>Điện Thoại: {receiverPhone}</p>
            <p>Mã Bưu Chính: 10189</p>
          </div>
        </div>

        <div className={style.content3}>
          <i>3. Loại hàng gửi:</i>
          <div>
            <input type="checkbox" id="taiLieu" checked={isTaiLieuChecked} onChange={() => handleCheckboxChange('taiLieu')}/>
            <label htmlFor="taiLieu" className={style.inline_checkbox}>
              Tài liệu
            </label>
            <input type="checkbox" id="hangHoa" checked={isHangHoaChecked} onChange={() => handleCheckboxChange('hangHoa')}/>
            <label htmlFor="hangHoa" className={style.inline_checkbox}>
              Hàng Hóa
            </label>
          </div>
          <i>4. Nội dung trị giá bưu gửi:</i>
        </div>

        <div className={style.content4}>
          <table>
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Khối lượng</th>
                <th>Trị giá</th>
                <th>Giấy tờ đính kèm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tổng</td>
                <td>{weight}kg</td>
                <td>{price}</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={style.content5}>
          <i>5. Dịch vụ đặc biệt Cộng thêm:</i>
          <br />{" "}
          ..................................................................................................................
          <br />{" "}
          ..................................................................................................................
          <br />
          Mã hợp đồng EMSC/PPA
        </div>

        <div className={style.content6}>
          <i>6. Chỉ dẫn của người gửi khi không phát được bưu gửi:</i>
          <br />
          <input type="checkbox" id="chuyenHoanNgay" />
          <label htmlFor="chuyenHoanNgay" className={style.inline_checkbox}>
            Chuyển hoàn ngay
          </label>
          <input type="checkbox" id="goiDien" />
          <label htmlFor="goiDien" className={style.inline_checkbox}>
            Gọi điện cho người gửi/BC gửi
          </label>
          <input type="checkbox" id="huy" />
          <label htmlFor="huy" className={style.inline_checkbox}>
            Hủy
          </label>
          <input type="checkbox" id="hangHoa" />
          <label htmlFor="hangHoa" className={style.inline_checkbox}>
            Chuyen hoàn trước ngày
          </label>
          <input type="checkbox" id="chuyenHoanTruoc" />
          <label htmlFor="chuyenHoanTruoc" className={style.inline_checkbox}>
            Chuyen hoàn khi hết thời gian lưu trữ
          </label>
        </div>

        <div className={style.content7}>
          <i>7. Cam kết của người gửi:</i>
          <br />
          Tôi chấp nhận các điều khoản tại mặt sau phiều gửi và cam đoan bưu gửi
          này không chứa những mặt hàng nguy hiểm, cầm gửi. Trường hợp không
          phát được hãy thực hiện chỉ dẫn tại mục 6, tôi sẽ trả cước chuyển
          hoàn.
        </div>

        <div className={style.content8}>
          <i>8. Ngày giờ gửi:</i>
          <i>Chữ kí người gửi</i>
          <br />
          <p>{format(new Date(date), 'hh:mm:ss dd/MM/yyyy')}</p>
        </div>

        <div className={style.content9}>
          <i>9. Cước:</i>
          <p>
            Cước chính: <i>{price}</i>
          </p>
          <p>
            Phụ phí: <i>0</i>
          </p>
          <p>
            Cước GTGT: <i>0</i>
          </p>
          <p>
            Tổng cước (gồm VAT): <i>{price}</i>
          </p>
          <p>
            Thu khác: <i>0</i>
          </p>
        </div>

        <div className={style.content10}>
          <i>10. Khối lượng (kg):</i>
          <br /> Khối lượng thực tế <i className={style.weight}>{weight}</i>
          <br /> Khối lượng quy đổi <i className={style.weight}>{weight}</i>
        </div>

        <div className={style.content11}>
          <i>11. Thu của người nhận:</i>
          <br /> COD: <i className={style.price}>0</i>
          <br /> Thu khác: <i className={style.price}>0</i>
          <br /> Tổng thu: <i className={style.price}>0</i>
        </div>

        <div className={style.content12}>
          <i>12. Chú dẫn nghiệp vụ:</i>
        </div>

        <div className={style.content13}>
          <i>13. Bưu cục chấp nhận</i>
          <br />
          Chữ ký GDV nhận
          <br />
          <img
            className={style.dauChuyenPhatImg}
            src={dauChuyenPhat}
            alt=""
          ></img>
          <i className={style.adminName}>GDV: {adminName}</i>
        </div>

        <div className={style.content14}>
          <i>14. Ngày giờ nhận:</i>
          <br /> .....h...../...../...../20.....
          <p>
            Người nhận/ Người được <br />
            ủy quyền nhận <br />
            (Ký, ghi rõ họ tên)
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryReceiptPage;
