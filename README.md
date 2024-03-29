# Magic Post
- Hệ thống quản lý chuyển phát

## Mục lục
  1. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt) 
  2. [Mô tả chung](#mô-tả-chung)
  3. [Chức năng đã cài đặt](#chức-năng-đã-cài-đặt)
  4. [Kĩ thuật sử dụng](#kĩ-thuật-sử-dụng)
  5. [Kết luận](#kết-luận)
  6. [Link Demo](https://youtu.be/hdTunhmhSyo)

---
# Nội dung

## Hướng dẫn cài đặt
  ### Build Web
  Tải project ( Download as zip) về máy hoặc dùng git
  ```
  git clone https://github.com/TDungx2k3/Magic_Post
  ```
  Mở 2 terminal tại folder đã tải 
  ```shell
  npm i
  cd .\frontend
  npm i
  npm start
  ```
  ```shell
  cd .\backend
  npm i
  npm start
  ```

  ## Mô tả chung
  MagicPost là công ty hoạt động trong lĩnh vực chuyển phát. Công ty này có các điểm giao dịch phủ khắp cả nước. Mỗi điểm giao dịch phụ trách một vùng. Ngoài các điểm giao dịch, công ty cũng có nhiều điểm tập kết hàng hóa. Mỗi điểm giao dịch sẽ làm việc với một điểm tập kết. Ngược lại, một điểm tập kết sẽ làm việc với nhiều điểm giao dịch.

  Người gửi, có hàng cần gửi, đem hàng đến một điểm giao dịch (thường là gần nhất) để gửi. Hàng, sau đó, được đưa đến điểm tập kết ứng với điểm giao dịch của người gửi, rồi được chuyển đến điểm tập kết ứng với điểm giao dịch của người nhận. Tại điểm giao dịch của người nhận, nhân viên giao hàng sẽ chuyển hàng đến tận tay người nhận.
  ## Chức năng đã cài đặt
  Công ty cần phát triển một phần mềm nhằm quản lý hệ thống chuyển phát nêu trên. Yêu cầu chức năng cho từng đối tượng sử dụng như sau:

  ### Chức năng cho lãnh đạo công ty
  Quản lý hệ thống các điểm giao dịch và điểm tập kết.
  Quản lý tài khoản trưởng điểm điểm tập kết và điểm giao dịch. Mỗi điểm giao dịch hoặc điểm tập kết có một tài khoản trưởng điểm.
  Thống kê hàng gửi, hàng nhận trên toàn quốc, từng điểm giao dịch hoặc điểm tập kết.
  ### Chức năng cho trưởng điểm tại điểm giao dịch
  Cấp tài khoản cho giao dịch viên tại điểm giao dịch.
  Thống kê hàng gửi, hàng nhận tại điểm giao dịch.
  ### Chức năng cho giao dịch viên tại điểm giao dịch
  Ghi nhận hàng cần gửi của khách (người gửi), in giấy biên nhận chuyển phát và phát cho khách hàng (tham khảo Hình 1 trong phụ lục).
  Tạo đơn chuyển hàng gửi đến điểm tập kết mỗi/trước khi đem hàng gửi đến điểm tập kết.
  Xác nhận (đơn) hàng về từ điểm tập kết.
  Tạo đơn hàng cần chuyển đến tay người nhận.
  Xác nhận hàng đã chuyển đến tay người nhận theo .
  Xác nhận hàng không chuyển được đến người nhận và trả lại điểm giao dịch.
  Thống kê các hàng đã chuyển thành công, các hàng chuyển không thành công và trả lại điểm giao dịch.
  ### Chức năng cho trưởng điểm tại điểm tập kết
  Quản lý tài khoản nhân viên tại điểm tập kết.
  Thống kê hàng đi, đến.
  ### Chức năng cho nhân viên tại điểm tập kết
  Xác nhận (đơn) hàng đi từ điểm giao dịch chuyển đến.
  Tạo đơn chuyển hàng đến điểm tập kết đích (ứng với điểm giao dịch đích, tức điểm giao dịch phụ trách vùng ứng với địa chỉ của người nhận).
  Xác nhận (đơn) hàng nhận về từ điểm tập kết khác.
  Tạo đơn chuyển hàng đến điểm giao dịch đích.
  ### Chức năng cho khách hàng
  Tra cứu trạng thái và tiến trình chuyển phát của kiện hàng mình gửi.

  ## Kĩ thuật sử dụng
  - Thiết kế: Logic, dễ sử dụng.
  - Giao diện: Responsive, đẹp, hiện đại, có bản sắc.
  - Hiệu năng: Sử dụng axios, không tải lại, backend API, sử dụng dữ liệu JSON, cập nhật DOM trên frontend.
  - Phong cách lập trình: Sử dụng mẫu thiết kế, tách biệt mã tạo giao diện và mã xử lý nghiệp vụ, sử dụng mô hình MVC, trình bày và chú thích mã.
  - Xử lý nhập liệu: Tự động điền, hiển thị điểm giao dịch, giá tiền.
  - An ninh: Xác thực, quản lý phiên, ngăn chặn người dùng có chức năng khác truy cập vào trang không liên quan, mã hóa mật khẩu.
  - Viết lại và/hoặc định tuyến URL.
  - Thao tác CSDL theo lập trình hướng đối tượng và độc lập CSDL.
  
  ## Kết luận
  > Trang Web đã được thiết kế và cung cấp đầy đủ chức năng cơ bản, nâng cao mong có thể đem lại lợi ích và trải nghiệm tốt cho khách hàng.

  [Về đầu trang](#magic-post)
