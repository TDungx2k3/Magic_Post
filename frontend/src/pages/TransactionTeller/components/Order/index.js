import clsx from "clsx"
import style from "./Order.module.scss"
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { OrderListStatusContext } from "../OrderList";

function Order(props) {
    const { updateFr, updateFrLost } = useContext(OrderListStatusContext);
    
    const navigate = useNavigate();

    // Chuyển đơn hàng đi khỏi điểm giao dịch
    const moveAction = async() => {
        if(props.data.status === 0) {
            try {
                await axios
                .post("http://localhost:8080/transTeller/createDeliveryStep1",
                {
                    unit: props.data.order_unit,
                    order_id: props.data.order_id,
                    
                })
                .then(() => {
                    updateFr(props.addition);
                })
            } catch (error) {
                console.log(error);
            }
        } else if(props.data.status === 6) {
            try {
                await axios
                .post("http://localhost:8080/transTeller/transToCustomerStep7",
                {
                    unit: props.data.order_unit,
                    order_id: props.data.order_id,
                })
                .then(() => {
                    updateFr(props.addition);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Xác nhận đơn hàng đã đến điểm giao dịch
    const cfSuccess = async() => {
        try {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios
            .post("http://localhost:8080/transTeller/confirmSuccessStep5",
            {
                order_id: props.data.order_id,
                to_unit: storedUserInfo.uUnit,
            })
            .then(() => {
                updateFr(props.addition);
                
            })
        } catch (error) {
            console.log(error);
        }
    };

    // Xử lý khách hàng chấp nhận đơn hàng
    const customerAccept = async() => {
        try {
            await axios
            .post("http://localhost:8080/transTeller/customerAccept",
            {
                order_id: props.data.order_id
            })
            .then(() => {
                setTimeout(() => {
                    updateFr(props.addition);
                }, 10);
            })
        } catch (error) {
            console.log(error);
        }
    };

    // Xử lý đơn hàng bị mất
    const lostOrder = async() => {
        
        await axios
        .post("http://localhost:8080/gatherTeller/lostOrder",
            {
                deliver_id: props.data.max_delivery,
                order_id: props.data.order_id,
            }
        )
        .then(() => {
            updateFrLost(props.addition);
        })
        
    };

    // Xử lý đơn hàng bị từ chối bởi khách hàng
    const cusDeny = async() => {
        const deliverIdResult = await axios.get("http://localhost:8080/transTeller/getMaxDelivery", { params : {
            order_id: props.data.order_id,
        }});
        console.log(deliverIdResult);
        await axios
        .post("http://localhost:8080/gatherTeller/customerDeny",
            {
                deliver_id: deliverIdResult.data.result,
                order_id: props.data.order_id,
            }
        )
        .then(() => {
            updateFrLost(props.addition);
        })
    }

    return (
        <Fragment>
            <div className={clsx(style.orderContainer)}
            data-aos="zoom-in-up" data-aos-duration="1000"
            >
                <div className={clsx(style.customersInfo)}>
                    <div className={clsx(style.senderInfo)}>
                        <div className={clsx(style.senderName)}>
                            <label>Sender Name: </label>
                            <span>{props.data.sender_name}</span>
                        </div>

                        <div className={clsx(style.senderPhone)}>
                            <label>Sender Phone: </label>
                            <span>{props.data.sender_phone}</span>
                        </div>
                    </div>

                    <div className={clsx(style.receiverInfo)}>
                        <div className={clsx(style.receiverName)}>
                            <label>Receiver Name: </label>
                            <span>{props.data.receiver_name}</span>
                        </div>

                        <div className={clsx(style.receiverPhone)}>
                            <label>Receiver Phone: </label>
                            <span>{props.data.receiver_phone}</span>
                        </div>

                        
                    </div>
                </div>

                <div className={clsx(style.orderInfoContainer)}>
                    <div className={clsx(style.orderInfo)}>

                    <div className={clsx(style.orderId)}>
                            <label>Order ID: </label>
                            <span>{props.data.order_id}</span>
                        </div>
                        
                        <div className={clsx(style.orderWeight)}>
                            <label>Order Weight: </label>
                            <span>{props.data.order_weight}</span>
                        </div>
                        
                        <div className={clsx(style.orderPrice)}>
                            <label>Order Price: </label>
                            <span>{props.data.order_price}</span>
                        </div>

                        <div className={clsx(style.orderDescription)}>
                            <label>Delivery Date: </label>
                            <span>{props.data.order_date}</span>
                        </div>

                        <div className={clsx(style.receiverAddress)}>
                            <label>Receiver Address: </label>
                            <span>{props.data.receiver_address}</span>
                        </div>
                    </div>

                    <div className={clsx(style.orderStatus)}>
                        <div className={clsx(style.cfStatus, {[style.hidden] : props.data.status !== 5})}>
                            <div className={clsx(style.successStatus)}
                            onClick={cfSuccess}
                            >Success</div>
                            <div className={clsx(style.pendingStatus)}
                            onClick={lostOrder}>Lost order</div>
                        </div>

                        <div className={clsx(style.inStatus, {[style.hidden] : props.data.status !== 0 && props.data.status !== 6})}>
                            <div className={clsx(style.moveAct)}
                            onClick={moveAction}
                            >Move</div>
                        </div>

                        <div className={clsx(style.shippingStatus, {[style.hidden] : props.data.status !== 7})}>
                            <div className={clsx(style.cusAcepted, )}
                            onClick={customerAccept}
                            >Success</div>
                            <div className={clsx(style.cusDenied, )}
                            onClick={cusDeny}>Denied</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Order;