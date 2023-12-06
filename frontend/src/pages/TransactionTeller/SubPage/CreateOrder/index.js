import clsx from "clsx";
import React from 'react';
import style from './CreateOrder.module.scss';

function CreateOrderPage() {
  return (
    <div className={style.container}>
      <header>
        <h1>Tạo đơn hàng chuyển phát</h1>
      </header>
      <div>
        <label htmlFor={style.customer_name}>Tên Người Gửi:</label>
      </div>
      <input/>
      <input className={clsx(style.customer_name)} type="text" name="customer_name"/>
      
      <div>
      <label htmlFor={style.customer_phone}>Số điện thoại người gửi:</label>
      </div>
      <input
        className={style.customer_phone}
        type="text"
        name="customer_phone"
      />

      <div>
      <label htmlFor={style.receiver_name}>Tên Người Nhận:</label>
      </div>
      <input className={style.receiver_name} type="text" name="receiver_name"/>

      <div>
      <label htmlFor={style.receiver_phone}>Số điện thoại người nhận:</label>
      </div>
      <input
        className={style.receiver_phone}
        type="text"
        name="receiver_phone"
      />

      <div>
      <label htmlFor={style.receiver_address}>Địa Chỉ Người Nhận:</label>
      </div>
      <input
        className={style.receiver_address}
        type="text"
        name="receiver_address"
      />

      <div>
      <label htmlFor={style.date}>Ngày gửi:</label>
      </div>
      <input className={style.date} type="text" name="date"/>

      <div>
      <label htmlFor={style.weight}>Cân nặng:</label>
      </div>
      <input className={style.weight} type="text" name="weight"/>

      <div>
      <label htmlFor={style.price}>Giá:</label>
      </div>
      <input className={style.price} type="text" name="price"/>
    </div>
  );
}

export default CreateOrderPage;
