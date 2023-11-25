import style from "../DeliveryReceiptPage/DeliveryReceiptPage.module.scss";
import clsx from "clsx";
import dauChuyenPhat from "../../assets/icons/dauChuyenPhat.png";

function DeliveryReceiptPage() {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <p className={style.logoEMS}>Phiếu gửi EMS</p>
        <p className={style.qrCode}>Số phiếu: EU103280832VN</p>
      </div>
      <div className={style.body}>
        <div className={style.content1}>
          <strong>1. Họ tên địa chỉ người gửi:</strong>
          <br />
          Trương Quang Đạt <br /> địa chỉ - Phường Dịch Vọng Hậu - Quận Cầu Giấy
          - TP Hà Nội
          <br />
          <br />
          <br />
          Điện Thoại:
          <div className={style.maNguoiGui}>
            <p>Mã Khách Hàng: </p>
            <p>Mã Bưu Chính: 10179</p>
          </div>
        </div>

        <div className={style.content2}>
          <strong>2. Họ tên địa chỉ người nhận</strong>
          <br />
          Trương Quang Đạt <br /> địa chỉ - Phường Dịch Vọng Hậu - Quận Cầu Giấy
          - TP Hà Nội
          <br />
          <br />
          <br />
          Mã ĐH:
          <div className={style.maNguoiNhan}>
            <p>Điện Thoại: </p>
            <p>Mã Bưu Chính: 10189</p>
          </div>
        </div>

        <div className={style.content3}>
          <strong>3. Loại hàng gửi:</strong>
          <div>
            <input type="checkbox" id="taiLieu" />
            <label for="taiLieu" className={style.inline_checkbox}>
              Tài liệu
            </label>
            <input type="checkbox" id="hangHoa" />
            <label for="hangHoa" className={style.inline_checkbox}>
              Hàng Hóa
            </label>
          </div>
          <strong>4. Nội dung trị giá bưu gửi:</strong>
        </div>

        <div className={style.content4}>
          <table>
            <tr>
              <th>Nội dung</th>
              <th>Số lượng</th>
              <th>Trị giá</th>
              <th>Giấy tờ đính kèm</th>
            </tr>
            <tr>
              <td>Tổng</td>
              <td>0</td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>

        <div className={style.content5}>
          <strong>5. Dịch vụ đặc biệt Cộng thêm:</strong>
          <br />{" "}
          ..................................................................................................................
          <br />{" "}
          ..................................................................................................................
          <br />
          Mã hợp đồng EMSC/PPA
        </div>

        <div className={style.content6}>
          <strong>6. Chỉ dẫn của người gửi khi không phát được bưu gửi:</strong>
          <br />
          <input type="checkbox" id="chuyenHoanNgay" />
          <label for="chuyenHoanNgay" className={style.inline_checkbox}>
            Chuyển hoàn ngay
          </label>
          <input type="checkbox" id="goiDien" />
          <label for="goiDien" className={style.inline_checkbox}>
            Gọi điện cho người gửi/BC gửi
          </label>
          <input type="checkbox" id="huy" />
          <label for="huy" className={style.inline_checkbox}>
            Hủy
          </label>
          <input type="checkbox" id="hangHoa" />
          <label for="hangHoa" className={style.inline_checkbox}>
            Chuyen hoàn trước ngày
          </label>
          <input type="checkbox" id="chuyenHoanTruoc" />
          <label for="chuyenHoanTruoc" className={style.inline_checkbox}>
            Chuyen hoàn khi hết thời gian lưu trữ
          </label>
        </div>

        <div className={style.content7}>
          <strong>7. Cam kết của người gửi:</strong>
          <br />
          Tôi chấp nhận các điều khoản tại mặt sau phiều gửi và cam đoan bưu gửi
          này không chứa những mặt hàng nguy hiểm, cầm gửi. Trường hợp không
          phát được hãy thực hiện chỉ dẫn tại mục 6, tôi sẽ trả cước chuyển
          hoàn.
        </div>

        <div className={style.content8}>
          <strong>8. Ngày giờ gửi:</strong>
          <strong>Chữ kí người gửi</strong>
          <br />
          <p>07h52/18/10/2023</p>
        </div>

        <div className={style.content9}>
          <strong>9. Cước:</strong>
          <p>
            Cước chính: <b>9.500</b>
          </p>
          <p>
            Phụ phí: <b>1.900</b>
          </p>
          <p>
            Cước GTGT: <b>0</b>
          </p>
          <p>
            Tổng cước (gồm VAT): <b>12.312</b>
          </p>
          <p>
            Thu khác: <b>0</b>
          </p>
        </div>

        <div className={style.content10}>
          <strong>10. Khối lượng (kg):</strong>
          <br /> Khối lượng thực tế <b>30</b>
          <br /> Khối lượng quy đổi <b>0</b>
        </div>

        <div className={style.content11}>
          <strong>11. Thu của người nhận:</strong>
          <br /> COD:
          <br /> Thu khác:
          <br /> Tổng thu:
        </div>

        <div className={style.content12}>
          <strong>12. Chú dẫn nghiệp vụ:</strong>
        </div>

        <div className={style.content13}>
          <strong>13. Bưu cục chấp nhận</strong>
          <br />
          Chữ ký GDV nhận
          <br />
          <img
            className={style.dauChuyenPhatImg}
            src={dauChuyenPhat}
            alt=""
          ></img>
          <br /> <i>GDV: Truong Quang Dat</i>
        </div>

        <div className={style.content14}>
          <strong>14. Ngày giờ nhận</strong>
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
